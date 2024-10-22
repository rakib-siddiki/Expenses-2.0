// Define an interface for Stock
interface Stock {
    id: string;
    quantity: number;
    originId: string;
    createdAt: string; // Use ISO date string format
    updatedAt: string; // Use ISO date string format
    itemId: string;
}

// Define an interface for Item with Stock
export type Item = {
    id: string;
    name: string;
    stock?: Stock;
    balance?: number;
};
export type ItemsResponse = {
    success: boolean;
    message: string;
    data: Item[];
};
