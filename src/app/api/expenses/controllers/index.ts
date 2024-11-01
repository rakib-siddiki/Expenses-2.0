import { Prisma } from '@prisma/client';
import { getBDTDayRange } from '@/lib/timeZone';
import { buy, sell } from '@/app/(home)/static';
import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { TExpensePayload } from '../types';
import { ExpenseSchema } from '../validations';

export const dynamic = 'force-dynamic';

// Create a new expense entry
export const onCreateExpense = async (payload: TExpensePayload) => {
    try {
        const { error } = ExpenseSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // Start a transaction to ensure sl_no uniqueness and handle stock update with avgRate
        const result = await db.$transaction(async (prisma) => {
            // Get the start and end of the day in BDT timezone for today
            const { startOfDay: todayStart, endOfDay: todayEnd } = getBDTDayRange(new Date());

            // Find the max sl_no for today by ordering in descending order of sl_no
            const lastExpenseToday = await prisma.expenses.findFirst({
                where: {
                    createdAt: {
                        gte: todayStart, // Get entries from today
                        lte: todayEnd, // Until the end of today
                    },
                    // accountId: payload.accountId,
                },
                orderBy: {
                    sl_no: 'desc', // Order by sl_no in descending order
                },
            });

            // Set the sl_no based on the last one found
            const sl_no = lastExpenseToday ? lastExpenseToday.sl_no + 1 : 1;

            // Ensure sl_no is within the range 1-999
            if (sl_no > 999) {
                return errorResponse('Max serial number reached for today', 400);
            }
            // ==================== STOCK HANDLING ========================================//
            // Handle stock update for both "SELL" and "BUY" types
            const stock = await prisma.stock.findFirst({
                where: { originId: payload.originId },
            });

            if (!stock)
                return errorResponse('Stock not found for the specified item and origin.', 400);

            const accounts = await prisma.account.findUnique({
                where: { id: payload.accountId },
            });

            if (!accounts) return errorResponse('Account not found', 400);
            // Check stock based on the type of expense
            let updatedStockQuantity;
            const stockQuantity = new Prisma.Decimal(stock.quantity);
            const payloadQuantity = new Prisma.Decimal(payload.quantity);
            // new balance
            let newBalance = 0;
            if (payload.type === sell) {
                if (stockQuantity.equals(0) || stockQuantity.lessThan(payloadQuantity)) {
                    return errorResponse(
                        'You don’t have enough stock. Please add stock first.',
                        400,
                    );
                }
                //  add the account balance according to the expense amount
                newBalance = accounts.balance + payload.amount;
                // Deduct the sold quantity from the stock
                updatedStockQuantity = stockQuantity.minus(payloadQuantity);
            } else if (payload.type === buy) {
                // Increment the stock quantity for the purchased items
                console.log(
                    `'stock' ${Number(stockQuantity)}stockQuantity} + 'payload'  ${Number(payloadQuantity)}`,
                );
                // minus the account balance according to the expense amount
                newBalance = accounts.balance - payload.amount;
                // Add the purchased quantity to the stock
                updatedStockQuantity = stockQuantity.plus(payloadQuantity);
            }

            // Update the stock quantity
            await prisma.stock.update({
                where: { id: stock.id },
                data: { quantity: updatedStockQuantity },
            });
            // update account balance
            await prisma.account.update({
                where: { id: payload.accountId },
                data: { balance: newBalance },
            });

            //======================= Avg Rate Calculation ========================================//
            // Calculate the average rate for the current item
            const previousExpenses = await prisma.expenses.findMany({
                where: {
                    itemId: payload.itemId,
                    type: payload.type,
                    createdAt: {
                        lt: new Date(), // Get all expenses before the current one
                    },
                    // accountId: payload.accountId,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });

            let totalAmount = new Prisma.Decimal(0); // Use Decimal for amount calculation
            let totalQuantity = new Prisma.Decimal(0); // Use Decimal for quantity calculation

            for (const prevExpense of previousExpenses) {
                totalAmount = totalAmount.plus(prevExpense.amount);
                totalQuantity = totalQuantity.plus(prevExpense.quantity);
            }

            totalAmount = totalAmount.plus(payload.amount);
            totalQuantity = totalQuantity.plus(payload.quantity);

            const avgRate = totalQuantity.gt(0)
                ? new Prisma.Decimal(totalAmount).div(totalQuantity).toDecimalPlaces(2)
                : new Prisma.Decimal(0);
            // Create the expense entry with the stock reference and calculated avgRate
            const expense = await prisma.expenses.create({
                data: {
                    ...payload,
                    sl_no,
                    stock: Number(updatedStockQuantity),
                    avgRate,
                },
            });

            return expense;
        });

        return successResponse(result, 'Expense created and stock updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find all expense entries
export const onFindExpenses = async () => {
    try {
        const expenses = await db.expenses.findMany({
            include: {
                user: true,
                item: true,
                origin: {
                    select: {
                        name: true,
                        itemId: true,
                        id: true,
                    },
                },
                Accounts: {
                    select: {
                        id: true,
                        accountName: true,
                    },
                },
            },
            orderBy: {
                sl_no: 'desc',
            },
        });
        if (!expenses || expenses.length === 0) return errorResponse('No expenses found', 200);

        return successResponse(expenses, 'Expenses fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find a expense entry
export const onFindExpense = async (id: string) => {
    try {
        const expense = await db.expenses.findUnique({ where: { id } });
        if (!expense) return errorResponse('Expense not found', 404);

        return successResponse(expense, 'Expense fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

export const onUpdateExpense = async (id: string, payload: TExpensePayload) => {
    try {
        // Validate the input payload using Zod schema
        const { error } = ExpenseSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // Start a database transaction to ensure atomic operations
        const result = await db.$transaction(async (prisma) => {
            // Step 1: Retrieve the existing expense
            const existingExpense = await prisma.expenses.findUnique({ where: { id } });
            if (!existingExpense) return errorResponse('Expense entry not found', 404);

            // Step 2: Fetch both accounts - existing and new
            const existingAccount = await prisma.account.findUnique({
                where: { id: existingExpense.accountId },
            });
            const newAccount = await prisma.account.findUnique({
                where: { id: payload.accountId },
            });

            // if (!existingAccount) return errorResponse('Existing account not found', 400);
            if (!newAccount) return errorResponse('New account not found', 400);

            // Step 3: Revert balance on the existing account if the account ID has changed
            if (existingExpense.accountId !== payload.accountId) {
                // Revert balance in the existing account
                let revertedBalance = existingAccount?.balance ?? 0;
                if (existingExpense.type === sell) {
                    revertedBalance -= existingExpense.amount;
                } else if (existingExpense.type === buy) {
                    revertedBalance += existingExpense.amount;
                }
                await prisma.account.update({
                    where: { id: existingExpense.accountId },
                    data: { balance: revertedBalance },
                });

                // Update balance on the new account
                let newBalance = newAccount.balance;
                if (payload.type === sell) {
                    newBalance += payload.amount;
                } else if (payload.type === buy) {
                    newBalance -= payload.amount;
                }
                await prisma.account.update({
                    where: { id: payload.accountId },
                    data: { balance: newBalance },
                });
            } else {
                // Adjust balance if only the amount or type has changed within the same account
                let adjustedBalance = existingAccount?.balance ?? 0;
                if (existingExpense.type === sell) {
                    adjustedBalance -= existingExpense.amount;
                } else if (existingExpense.type === buy) {
                    adjustedBalance += existingExpense.amount;
                }

                if (payload.type === sell) {
                    adjustedBalance += payload.amount;
                } else if (payload.type === buy) {
                    adjustedBalance -= payload.amount;
                }

                await prisma.account.update({
                    where: { id: payload.accountId },
                    data: { balance: adjustedBalance },
                });
            }

            // Step 4: Handle stock adjustments
            const oldStock = await prisma.stock.findFirst({
                where: { originId: existingExpense.originId },
            });
            const newStock = await prisma.stock.findFirst({
                where: { originId: payload.originId },
            });
            if (!oldStock || !newStock)
                return errorResponse('Stock not found for the specified item and origin.', 400);

            const oldStockQuantity = new Prisma.Decimal(oldStock.quantity);
            const newStockQuantity = new Prisma.Decimal(newStock.quantity);
            const payloadQuantity = new Prisma.Decimal(payload.quantity);

            const updateStock = (
                currentQuantity: Prisma.Decimal,
                expense: TExpensePayload,
                isRevert: boolean,
            ) => {
                const multiplier = isRevert ? -1 : 1;
                const quantityDecimal = new Prisma.Decimal(expense.quantity);
                return expense.type === buy
                    ? currentQuantity.plus(quantityDecimal.mul(multiplier))
                    : currentQuantity.minus(quantityDecimal.mul(multiplier));
            };

            const updatedOldStockQuantity = updateStock(oldStockQuantity, existingExpense, true);
            const updatedNewStockQuantity = updateStock(
                existingExpense.originId === payload.originId
                    ? updatedOldStockQuantity
                    : newStockQuantity,
                payload,
                false,
            );

            if (updatedNewStockQuantity.lt(0)) {
                return errorResponse('Not enough stock available for this update.', 400);
            }

            if (existingExpense.originId !== payload.originId) {
                await prisma.stock.update({
                    where: { id: oldStock.id },
                    data: { quantity: updatedOldStockQuantity },
                });
            }
            await prisma.stock.update({
                where: { id: newStock.id },
                data: { quantity: updatedNewStockQuantity },
            });

            const newAvgRate = payloadQuantity.gt(0)
                ? new Prisma.Decimal(payload.amount).div(payloadQuantity).toDecimalPlaces(2)
                : new Prisma.Decimal(0);

            // Step 5: Update the expense entry
            const updatedExpense = await prisma.expenses.update({
                where: { id },
                data: {
                    accountId: payload.accountId,
                    type: payload.type,
                    itemId: payload.itemId,
                    originId: payload.originId,
                    amount: payload.amount,
                    stock: updatedNewStockQuantity,
                    quantity: payloadQuantity,
                    avgRate: newAvgRate,
                },
            });

            return updatedExpense;
        });
        // Return success response with updated expense data
        return successResponse(result, 'Expense updated and stock adjusted successfully');
    } catch (error) {
        // Handle any unexpected errors
        return errorResponse('Internal server error', 500);
    }
};

// Delete an existing expense entry and reset stock
export const onDeleteExpense = async (id: string) => {
    try {
        // Check if the expense entry exists
        const existingExpense = await db.expenses.findUnique({ where: { id } });
        if (!existingExpense) return errorResponse('Expense entry not found', 404);

        // Find the related stock entry
        const stock = await db.stock.findFirst({
            where: { originId: existingExpense.originId },
        });

        if (!stock) return errorResponse('Stock not found for the specified item and origin.', 400);
        const stockQuantity = new Prisma.Decimal(stock.quantity);
        const existingExpenseQuantity = new Prisma.Decimal(existingExpense.quantity);
        // Retrieve the associated account
        const account = await db.account.findUnique({
            where: { id: existingExpense.accountId },
        });
        if (!account) return errorResponse('Account not found', 404);
        // Calculate the updated stock quantity
        let updatedStockQuantity;
        let updatedBalance;
        if (existingExpense.type === sell) {
            // Add back the sold quantity to the stock
            updatedStockQuantity = stockQuantity.plus(existingExpenseQuantity);
            updatedBalance = account.balance - existingExpense.amount;
        } else if (existingExpense.type === buy) {
            // Subtract the purchased quantity from the stock
            updatedStockQuantity = stockQuantity.minus(existingExpenseQuantity);
            updatedBalance = account.balance + existingExpense.amount;
        }

        // Update the stock quantity
        await db.stock.update({
            where: { id: stock.id },
            data: { quantity: updatedStockQuantity },
        });
        // Update the account balance
        await db.account.update({
            where: { id: existingExpense.accountId },
            data: { balance: updatedBalance },
        });
        // Delete the expense entry
        await db.expenses.delete({ where: { id } });
        // Update sl_no for all expenses with higher sl_no
        await db.expenses.updateMany({
            where: { sl_no: { gt: existingExpense.sl_no } },
            data: { sl_no: { decrement: 1 } },
        });
        return successResponse('Expense deleted and stock reset successfully');
    } catch (error) {
        return errorResponse('Failed to delete expense and reset stock', 500);
    }
};
