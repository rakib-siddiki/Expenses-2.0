import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { TStockPayload } from '../types';
import { StockSchema } from '../validations';
import { Prisma } from '@prisma/client';

// Create a new stock entry
export const onCreateStock = async (payload: TStockPayload) => {
    try {
        // Validate the payload using Zod schema
        const { error } = StockSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // Check if the stock entry already exists for the same item and origin
        const isStockExisting = await db.stock.findFirst({
            where: {
                originId: payload.originId,
            },
        });

        if (isStockExisting) {
            return errorResponse(
                'Stock already exists for this item and origin. Update that instead.',
                404,
            );
        }

          // Create the stock entry with the quantity as Prisma.Decimal
        const stock = await db.stock.create({
            data: {
                quantity: new Prisma.Decimal(payload.quantity), // Convert quantity to Decimal
                originId: payload.originId,
            },
        });

        if (!stock) return errorResponse('Stock creation failed', 404);

        return successResponse(stock, 'Stock created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find all stock entries
export const onFindStocks = async () => {
    try {
        const stocks = await db.stock.findMany({
            include: {
                origin: {
                    select: {
                        name: true,
                        stock: true,
                        item: true,
                    },
                },
            },
        });
        if (!stocks || stocks.length === 0) return errorResponse('No stock entries found', 200);

        return successResponse(stocks, 'Stocks fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update an existing stock entry
export const onUpdateStock = async (id: string, payload: TStockPayload) => {
    try {
        const { error } = StockSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // Check if the stock entry exists
        const existingStock = await db.stock.findUnique({ where: { id } });
        if (!existingStock) return errorResponse('Stock entry not found', 404);

       // Update the stock entry with the quantity as Prisma.Decimal
        const stock = await db.stock.update({
            where: { id },
            data: {
                ...payload,
                quantity: new Prisma.Decimal(payload.quantity), // Convert quantity to Decimal
            },
        });
        if (!stock) return errorResponse('Stock update failed', 404);

        return successResponse(stock, 'Stock updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};
