import { z } from 'zod';

// Define the ExpenseType enum
const ExpenseTypeEnum = z.enum(['BUY', 'SELL']);

// Create Zod schema for the Expense model
export const ExpenseSchema = z.object({
    userId: z.string().uuid({ message: 'Invalid user ID' }),
    type: ExpenseTypeEnum,
    itemId: z.string().uuid({ message: 'Invalid item ID' }),
    originId: z.string().uuid({ message: 'Invalid origin ID' }),
    amount: z.number(),
    quantity: z.number(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type TExpenseValidation = z.infer<typeof ExpenseSchema>;
