// TStockPayload.ts
export type TStockPayload = {
    quantity: number;
    originId: string;
};

interface Item {
    id: string;
    name: string;
}

interface Origin {
    id: string;
    name: string;
    itemId: string;
    item: Item;
}

interface Stock {
    id: string;
    quantity: number;
    originId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    avgBuyRate?: string;
    origin: Origin;
}
// StockResponse.ts
export interface StockResponse {
    success: boolean;
    data?: Stock[];
    message?: string;
}
