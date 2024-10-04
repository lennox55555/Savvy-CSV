import { RegistrationFormData, SignInFormData } from "../utils/types";
declare class UserServiceAPI {
    private static instance;
    private constructor();
    static getInstance(): UserServiceAPI;
    registerUser(userData: RegistrationFormData): Promise<void>;
    signInUser(userData: SignInFormData): Promise<void>;
    signInWithGoogle(): Promise<void>;
    isLoggedIn(): Promise<boolean>;
    signOutUser(): Promise<void>;
}
export default UserServiceAPI;
