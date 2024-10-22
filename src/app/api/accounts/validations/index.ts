import { z } from 'zod';

// Zod schema for validating Account creation and updates
export const AccountSchema = z.object({
    accountName: z
        .string({ required_error: 'Account name is required' })
        .min(1, { message: 'Account name is required' }),
    balance: z
        .number({ required_error: 'Balance is required' })
        .min(0, { message: 'Balance must be at least 0' }),
});

export type TAccountValidation = z.infer<typeof AccountSchema>;
