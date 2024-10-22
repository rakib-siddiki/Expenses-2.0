// pages/api/logout.ts

import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
export const GET = async (req: NextRequest) => {
    // Create a response object
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Set the 'userId' cookie to expire immediately
    response.cookies.set('userId', '', {
        path: '/',
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    return response;
};
