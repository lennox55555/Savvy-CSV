declare class SavvyServiceAPI {
    private static instance;
    private webSocket;
    private tableObject;
    private constructor();
    static getInstance(): SavvyServiceAPI;
    saveMessage(userId: string, message: string, sentByUser: boolean, conversationId: string | undefined): Promise<void>;
    updateLastMessage(userId: string, source: string, rank: number, conversationId: string): Promise<void>;
    getMessages(userId: string, conversationId: string | undefined): Promise<{
        id: string;
        text: any;
        user: any;
        source: any;
        rank: any;
        table: any;
    }[]>;
    createNewConversation(userId: string): Promise<string>;
    initializeWebSocket(onMessageReceived: (data: any) => void, userQuery: string, userId: string, conversationId: string | undefined): void;
    private sendQueries;
    private handleMessage;
}
export default SavvyServiceAPI;
