import { z } from 'zod';

// Zod schema for validating Item creation
export const ItemSchema = z.object({
    name: z
        .string({ required_error: 'Item name is required' })
        .min(1, { message: 'Item name is required' }),
});

export type TItemValidation = z.infer<typeof ItemSchema>;
