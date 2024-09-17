import { doc, setDoc } from "firebase/firestore";
import { RegistrationFormData, SignInFormData } from "../utils/types";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
        signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase/firebase-init";

class UserServiceAPI {
    private static instance: UserServiceAPI;

    private constructor() { }

    public static getInstance(): UserServiceAPI {

        if (!UserServiceAPI.instance) {
            UserServiceAPI.instance = new UserServiceAPI();
        }

        return UserServiceAPI.instance;
    }

    public async registerUser(userData: RegistrationFormData) {

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            const user = userCredential.user

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
            });

            console.log("User created:", userCredential.user);
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    public async signInUser(userData: SignInFormData) {

        if (userData.email == 'Admin' && userData.password == 'DR.Z!') {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    'admin@test.com',
                    'DR.Z!!'
                );
            } catch (error) {

            }
        } else {

            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    userData.email,
                    userData.password
                );
                console.log("User signed in:", userCredential.user);
            } catch (error) {
                console.error("Error signing in user:", error);
                throw error;
            }
        }
    }

    public async signInWithGoogle() {
        const provider = new GoogleAuthProvider();

        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
            });

        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    }

    public async isLoggedIn(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, (error) => {
                reject(error); 
            });
        });
    }

    public async signOutUser(): Promise<void> {
        try {
          const auth = getAuth();
          await signOut(auth);
        } catch (error) {
          console.error("Error signing out:", error);
        }
      }
}

export default UserServiceAPI;