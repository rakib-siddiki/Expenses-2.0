import { z } from 'zod';

// Define the Role enum
const RoleEnum = z.enum(['ADMIN', 'USER']);

// Create Zod schema for the Register model
export const UserSchema = z.object({
    userName: z
        .string({ required_error: 'Username is required' })
        .min(1, { message: 'Username is required' }), // Non-empty string
    email: z.string().email().optional(), // Optional valid email
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, { message: 'Password is required' }), // Min length for password
    role: RoleEnum.default('USER'), // Enum validation with default 'USER'
});

export type TRegisterValidation = z.infer<typeof UserSchema>;
