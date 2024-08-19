import { RegistrationFormData, SignInFormData } from "../utils/types";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

class UserServiceAPI {
    private static instance: UserServiceAPI;

    private constructor() {

    }

    public static getInstance(): UserServiceAPI {

        if (!UserServiceAPI.instance) {
            UserServiceAPI.instance = new UserServiceAPI();
        }

        return UserServiceAPI.instance;
    }

    public async registerUser(userData: RegistrationFormData) {
        const auth = getAuth();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );
            console.log("User created:", userCredential.user);
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    public async signInUser(userData: SignInFormData) {
        const auth = getAuth();

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

export default UserServiceAPI