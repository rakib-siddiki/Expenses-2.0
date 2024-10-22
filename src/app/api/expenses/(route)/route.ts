import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onCreateExpense, onFindExpenses } from '../controllers';
import { TExpensePayload } from '../types';

export const dynamic = 'force-dynamic';

// Handle POST request to create a new expense
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TExpensePayload;
        const res = await onCreateExpense(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Handle GET request to fetch all expenses
export const GET = async () => {
    try {
        // const searchParams = new URLSearchParams(req.nextUrl.searchParams);
        // const date = searchParams.get('date');
        // if (date) {
        //     const dateParam = new Date(date);
        //     return await fetchExpensesForDate(dateParam);
        // }
        const res = await onFindExpenses();
        return res;
    } catch (err) {
        return errorResponse('Internal Server error');
    }
};
