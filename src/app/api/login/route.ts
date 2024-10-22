import { NextRequest, NextResponse } from 'next/server';
import { TSeller } from '@/types/seller';
import { ILogin, onLogin } from '@/app/actions/login';

export interface ILoginResponse {
    success: boolean;
    message: string;
    user: TSeller;
}

export const POST = async (request: NextRequest) => {
    try {
        const body = (await request.json()) as ILogin;
        const data = (await onLogin(body)) as ILoginResponse;

        if (!data.success) {
            return NextResponse.json({
                success: false,
                message: data.message || 'Login failed.',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Login successful.',
            data: data.user, // Return only relevant user data
        });
    } catch (error) {
        console.error('Error in POST login handler:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error during login.',
        });
    }
};
