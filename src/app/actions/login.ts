'use server';

import { cookies } from 'next/headers';
import prisma from '../api/helpers/prismaClient';

export interface ILogin {
    email?: string;
    userName: string;
    password: string;
}

export const onLogin = async (body: ILogin) => {
    const { email, userName, password } = body;
    try {
        // Find user by either email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ userName }, { email }],
            },
        });
        // If user not found
        if (!user) {
            return {
                success: false,
                message: 'User not found.',
            };
        }

        // Verify the password
        const isPasswordValid = password === user.password;

        // If password is incorrect
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Invalid password.',
            };
        }
        // Set the 'userId' cookie with secure options after successful login
        cookies().set({
            name: 'userId',
            value: user.id, // Store user ID
            httpOnly: true, // Secure flag, cookie not accessible via client-side JS
            secure: process.env.NODE_ENV === 'production', // Only use secure in production
            sameSite: 'strict', // Protect against CSRF attacks
            path: '/', // Cookie accessible on all paths
            maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days
        });
        const response = {
            success: true,
            message: 'Login successful.',
            user: {
                id: user.id,
                userName: user.userName,
                email: user.email,
                role: user.role,
            },
        };
        // Set the 'userId' cookie with secure options

        return response;
    } catch (error) {
        console.error('Error during login:', error);
        return {
            success: false,
            message: 'Internal server error during login.',
        };
    }
};
