import { z } from 'zod';

// Zod schema for validating Stock creation
export const StockSchema = z.object({
    quantity: z
        .number({ required_error: 'Quantity is required' })
        .min(0, { message: 'Quantity must be at least 0' }),
    originId: z
        .string({ required_error: 'Origin ID is required' })
        .min(1, { message: 'Origin ID is required' }), // Foreign key relation to Origin
});

export type TStockValidation = z.infer<typeof StockSchema>;
