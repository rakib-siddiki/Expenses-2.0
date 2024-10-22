'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// eslint-disable-next-line @typescript-eslint/require-await
export const onLogout = async () => {
    try {
        // Clear the 'userId' cookie to log the user out
        cookies().set('userId', '', {
            path: '/',
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Revalidate the cache for the current path (optional)
        revalidatePath('/');

        // Return success to the client-side
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, message: 'Internal server error during logout.' };
    }
};
