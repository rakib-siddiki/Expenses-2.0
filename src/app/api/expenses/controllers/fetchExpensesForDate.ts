import { Prisma } from '@prisma/client';
import { TExpensesResponeData } from '@/types/expenses';
import { getBDTDayRange } from '@/lib/timeZone';
import { db, errorResponse, successResponse } from '../../helpers';

export const fetchExpensesForDate = async (date: Date) => {
    try {
        // Convert the provided date to the start and end times for that day
        const { startOfDay, endOfDay } = getBDTDayRange(date);
        const expenses = await db.expenses.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                user: true,
            },
            orderBy: {
                sl_no: 'desc',
            },
        });
        if (!expenses || expenses.length === 0)
            return { success: false, message: 'No expenses found' };
        // Convert Decimal to string for serialization
        const serializedExpenses = expenses.map((expense) => ({
            ...expense,
            avgRate:
                expense.avgRate instanceof Prisma.Decimal
                    ? expense.avgRate.toString()
                    : expense.avgRate,
        }));

        const data = serializedExpenses as unknown as TExpensesResponeData[];
        return successResponse(data, 'Expenses fetched successfully');
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return errorResponse('Internal server error', 500);
    }
};
