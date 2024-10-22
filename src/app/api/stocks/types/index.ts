export type TStockPayload = {
    id?: string;
    quantity: number;
    originId: string; // Foreign key relation to the Origin
    itemId: string;
};

export type TStockResponse = {
    id: string;
    quantity: number;
    originId: string;
    createdAt: string;
    updatedAt: string;
};
