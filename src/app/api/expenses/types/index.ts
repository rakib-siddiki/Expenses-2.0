import { Decimal } from '@prisma/client/runtime/library';

export type TExpensePayload = {
    id?: string; // Optional for updates
    userId: string;
    type: 'BUY' | 'SELL';
    itemId: string;
    originId: string;
    amount: number;
    accountId: string;
    quantity: Decimal;
    createdAt?: Date; // Optional for updates
    updatedAt?: Date; // Optional for updates
};

export type TExpenseResponse = {
    id: string;
    userId: string;
    type: 'BUY' | 'SELL';
    itemId: string;
    originId: string;
    amount: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
};
