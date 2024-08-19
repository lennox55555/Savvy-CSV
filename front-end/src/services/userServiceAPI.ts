import { RegistrationFormData, SignInFormData } from "../utils/types";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
    }

}

export default UserServiceAPI