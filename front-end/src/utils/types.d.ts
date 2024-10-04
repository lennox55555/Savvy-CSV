export type RegistrationFormData = {
    email: string;
    password: string;
};
export type SignInFormData = {
    email: string;
    password: string;
};
export type UserMessage = {
    id: string;
    text: string | JSX.Element | null;
    user: boolean;
    source: string;
    rank: number | null;
    table: TableObject | null;
};
export type TableObject = {
    [key: string]: {
        rankOfTable: number;
        SampleTableData: string;
        website: string;
    };
};
export type UserConversation = {
    id: string;
    title: any;
    timestamp: any;
    display: any;
};
