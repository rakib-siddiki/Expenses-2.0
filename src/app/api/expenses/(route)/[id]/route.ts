import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteExpense, onFindExpense, onUpdateExpense } from '../../controllers';
import { TExpensePayload } from '../../types';

export const dynamic = 'force-dynamic';
// Get Expense by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const Expense = await onFindExpense(id);
        return Expense;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update Expense data by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const data = (await req.json()) as TExpensePayload;
        const updatedExpense = await onUpdateExpense(id, data);
        return updatedExpense; // Return JSON response
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete Expense by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const deletedExpense = await onDeleteExpense(id);
        return deletedExpense;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
