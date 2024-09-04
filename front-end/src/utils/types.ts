export type RegistrationFormData = {
    email: string,
    password: string
}

export type SignInFormData = {
    email: string,
    password: string
}

export type UserMessage = {
    id: string;
    text: string | JSX.Element | null;
    user: boolean;
}