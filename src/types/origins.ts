import { Item } from './items';

// types/origins.ts
export type TOriginPayload = {
    name: string;
    itemId: string;
};

export type OriginsResponse = {
    data: {
        id: string;
        name: string;
        itemId: string;
        item: Item;
        stock?: Stock[];
    }[];
    success: boolean;
};

interface Stock {
    id: string;
    quantity: number;
    originId: string;
    createdAt: string;
    updatedAt: string;
    itemId: string;
}
