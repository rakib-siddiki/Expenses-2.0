import { TAccountResponse } from '@/app/api/accounts/types';
import { Item } from './items';
import { TSeller } from './seller';

export type TExpenses = {
    id?: string;
    sl_no?: number;
    userId?: string;
    role?: 'ADMIN' | 'USER';
    itemId?: string;
    originId?: string;
    accountId: string;
    Accounts: TAccountResponse;
    type: 'BUY' | 'SELL';
    seller: string;
    item: string;
    origin: string;
    amount: number;
    quantity: number;
    stock: number;
    createdAt?: Date;
    user?: TSeller;
    avgRate: string;
};
export type TSelectedState = {
    seller: string;
    origin: string;
    item: string;
    account: string;
};
export type ExpensePaylaod = {
    id?: string;
    userId: string;
    accountId: string;
    type: 'BUY' | 'SELL'; // Expense type
    itemId: string;
    originId: string;
    amount: number;
    quantity: number;
    stock?: number;
    createdAt?: Date; // DateTime as ISO string
    updatedAt?: Date; // DateTime as ISO string
};
export type TExpensesResponeData = {
    id: string;
    sl_no: number;
    userId: string;
    type: 'BUY' | 'SELL'; // Expense type
    itemId: string;
    item: Item;
    originId: string;
    accountId: string;
    origin: {
        id: string;
        name: string;
        itemId: string;
    };
    Accounts: TAccountResponse;
    user: TSeller;
    amount: number;
    quantity: number;
    stock?: number;
    avgRate: string;
    createdAt?: Date; // DateTime as ISO string
    updatedAt?: Date; // DateTime as ISO string
};

export interface ExpensesResponse {
    success: boolean;
    message?: string;
    data?: TExpensesResponeData[];
    error?: string;
}
