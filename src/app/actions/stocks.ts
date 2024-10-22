'use server';

import { API_BASE_URL } from '@/configs/env';
import { tryCatch } from '@/http';
import { revalidatePath } from 'next/cache';
import { StockResponse, TStockPayload } from '@/types/stocks';
import { db } from '../api/helpers';

// Add Stock
export const addStockAction = async (payload: TStockPayload) => {
    // Check if the stock entry already exists for the same item (optional logic)
    const isStockExisting = await db.stock.findFirst({
        where: {
            originId: payload.originId,
        },
    });

    if (isStockExisting) {
        return {
            success: false,
            message: 'Stock already exists for this item and origin update that instead',
        };
    }

    const [res, error] = await tryCatch<StockResponse>(`${API_BASE_URL}/stocks`, payload, {
        method: 'POST',
    });

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/dashboard/add-stock');
    return {
        success: true,
        data: res?.data,
    };
};

// Get Stocks
export const getStocksAction = async () => {
    const [res, error] = await tryCatch<StockResponse>(`${API_BASE_URL}/stocks`);

    if (error) {
        return { success: false, message: 'Failed to fetch stocks. Please try again later.' };
    }

    revalidatePath('/dashboard/add-stock');

    return {
        success: true,
        data: res?.data,
    };
};
// get stock with leatest BUY avgRate

export const getStocksWithAvgRateAction = async () => {
    try {
        const stocks = await db.$transaction(async (prisma) => {
            // Fetch all stocks
            const allStocks = await prisma.stock.findMany({
                include: {
                    origin: {
                        select: {
                            id: true,
                            name: true,
                            stock: true,
                            itemId: true,
                            item: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            // Calculate avg buy rate for each stock
            const stocksWithAvgRate = await Promise.all(
                allStocks.map(async (stock) => {
                    // Get the latest BUY expense for this stock
                    const latestBuyExpense = await prisma.expenses.findFirst({
                        where: {
                            itemId: stock.origin.itemId,
                            type: 'BUY',
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    });
                    let avgBuyRate;
                    if (latestBuyExpense) {
                        avgBuyRate = latestBuyExpense.avgRate;
                    }
                    return {
                        ...stock,
                        avgBuyRate: (avgBuyRate ?? 0).toString(), // Convert to string for serialization
                    };
                }),
            );

            return stocksWithAvgRate;
        });

        return { success: true, data: stocks };
    } catch (error) {
        console.error('Error in getStocksAction:', error);
        return { success: false, message: 'Failed to fetch stocks. Please try again.' };
    }
};

// Edit (Update) Stock
export const editStockAction = async (id: string, payload: TStockPayload) => {
    const [res, error] = await tryCatch<StockResponse>(`${API_BASE_URL}/stocks/${id}`, payload, {
        method: 'PUT',
    });
    if (error) {
        return { success: false, message: 'Failed to update stock. Please try again later.' };
    }
    revalidatePath('/dashboard/add-stock');
    return {
        success: true,
        data: res?.data,
    };
};
