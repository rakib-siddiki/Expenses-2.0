'use server';

import { API_BASE_URL } from '@/configs/env';
import { tryCatch } from '@/http';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { ExpensePaylaod, ExpensesResponse, TExpensesResponeData } from '@/types/expenses';
import { getBDTDayRange } from '@/lib/utils';
import { db } from '../api/helpers';
import prisma from '../api/helpers/prismaClient';

// Add Expense
export const addExpenseAction = async (payload: ExpensePaylaod) => {
    // Handle stock update for both "SELL" and "BUY" types
    const stock = await prisma.stock.findFirst({
        where: { originId: payload.originId },
    });
    if (!stock)
        return { success: false, message: 'Stock not found for the specified item and origin.' };
    const stockQuantity = new Prisma.Decimal(stock?.quantity);
    const payloadQuantity = new Prisma.Decimal(payload.quantity);
    if (payload.type === 'SELL') {
        if (stockQuantity.equals(0) || stockQuantity.lessThan(payloadQuantity)) {
            return {
                success: false,
                message: 'don’t have enough stock. Please add stock first.',
            };
        }
    }
    const [res, error] = await tryCatch<ExpensesResponse>(`${API_BASE_URL}/expenses`, payload, {
        method: 'POST',
    });

    if (error) {
        return { success: false, message: 'Failed to add expense. Please try again later.' };
    }

    revalidatePath('/');
    return {
        success: true,
        data: res?.data,
    };
};

// Get Expenses
export const getExpensesAction = async () => {
    const [res, error] = await tryCatch<ExpensesResponse>(`${API_BASE_URL}/expenses`);

    if (error) {
        return { success: false, message: 'Failed to fetch expenses. Please try again later.' };
    }
    revalidatePath('/');
    return {
        success: true,
        data: res?.data,
    };
};

// Fetch expenses for a specific date
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
                Accounts: {
                    select: {
                        id: true,
                        accountName: true,
                        balance: true,
                    },
                },
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
            quantity:
                expense.quantity instanceof Prisma.Decimal
                    ? expense.quantity.toString()
                    : expense.quantity,
            stock:
                expense.stock instanceof Prisma.Decimal ? expense.stock.toString() : expense.stock,
        }));

        const data = serializedExpenses as unknown as TExpensesResponeData[];
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return { success: false, message: 'Failed to fetch expenses. Please try again later.' };
    }
};

// Edit (Update) Expense
export const editExpenseAction = async (
    id: string,
    payload: ExpensePaylaod,
    userRole: 'ADMIN' | 'USER',
) => {
    // Fetch the existing expense
    const existingExpense = await prisma.expenses.findUnique({ where: { id } });

    if (!existingExpense) {
        return { success: false, message: 'Expense not found.' };
    }

    // Check if the user is not an admin
    if (userRole !== 'ADMIN') {
        // Check if the expense was created today
        const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        const expenseDate = new Date(existingExpense.createdAt).toLocaleString('en-US', {
            timeZone: 'Asia/Dhaka',
        });
        const expenseDateObject = new Date(expenseDate);

        const isExpenseFromToday =
            expenseDateObject >= startOfToday && expenseDateObject <= endOfToday;

        // If the expense is not from today, prevent the update
        if (!isExpenseFromToday) {
            return { success: false, message: 'You can only update expenses created today.' };
        }
    }

    // Handle stock update for both "SELL" and "BUY" types
    const stock = await prisma.stock.findFirst({
        where: { originId: payload.originId },
    });
    if (!stock)
        return { success: false, message: 'Stock not found for the specified item and origin.' };

    // const stockQuantity = new Prisma.Decimal(stock?.quantity);
    // const payloadQuantity = new Prisma.Decimal(payload.quantity);
    // if (
    //     payload.type === 'SELL' &&
    //     (stockQuantity.equals(0) || stockQuantity.lessThan(payloadQuantity))
    // ) {
    //     return {
    //         success: false,
    //         message: `You don't have enough stock. Please add stock first.`,
    //     };
    // }

    const [res, error] = await tryCatch<ExpensesResponse>(
        `${API_BASE_URL}/expenses/${id}`,
        payload,
        {
            method: 'PUT',
        },
    );
    if (error) {
        console.log('🚀 > file: expenses.ts:170 > error:', error);
        return { success: false, message: 'Failed to update expense. Please try again later.' };
    }

    revalidatePath('/');
    return {
        success: true,
        data: res?.data,
    };
};

// Delete Expense
export const deleteExpenseAction = async (id: string, userRole: 'ADMIN' | 'USER') => {
    // Check if the expense exists
    const existingExpense = await db.expenses.findUnique({
        where: { id },
    });

    if (!existingExpense) {
        return {
            success: false,
            message: 'Expense not found',
        };
    }

    // Check if the user is not an admin
    if (userRole !== 'ADMIN') {
        // Check if the expense was created today
        const today = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        const expenseDate = new Date(existingExpense.createdAt).toLocaleString('en-US', {
            timeZone: 'Asia/Dhaka',
        });
        const expenseDateObject = new Date(expenseDate);

        const isExpenseFromToday =
            expenseDateObject >= startOfToday && expenseDateObject <= endOfToday;

        // If the expense is not from today, prevent the deletion
        if (!isExpenseFromToday) {
            return { success: false, message: 'You can only delete expenses created today.' };
        }
    }

    const [res, error] = await tryCatch<ExpensesResponse>(
        `${API_BASE_URL}/expenses/${id}`,
        undefined,
        {
            method: 'DELETE',
        },
    );

    if (error) {
        return { success: false, message: 'Failed to delete expense. Please try again later.' };
    }

    revalidatePath('/');
    return {
        success: true,
        message: 'Expense deleted successfully',
        data: res?.data,
    };
};
