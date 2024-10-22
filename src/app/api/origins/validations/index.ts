import { z } from 'zod';

// Zod schema for validating Origin creation
export const OriginSchema = z.object({
    name: z
        .string({ required_error: 'Origin name is required' })
        .min(1, { message: 'Origin name is required' }),
    itemId: z
        .string({ required_error: 'Item ID is required' })
        .min(1, { message: 'Item ID is required' }), // Foreign key relation to Item
});

export type TOriginValidation = z.infer<typeof OriginSchema>;
