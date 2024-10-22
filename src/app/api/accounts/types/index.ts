export type TAccountPayload = {
    id?: string;
    accountName: string; // Unique name for the account
    balance: number; // Account balance
};

export type TAccountResponse = {
    id: string;
    accountName: string;
    balance: number;
    createdAt?: string;
    updatedAt?: string;
};
