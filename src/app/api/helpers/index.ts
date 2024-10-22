import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export { default as db } from './prismaClient';

export const successResponse = (data: unknown, message: string = 'Request successful') => {
    return NextResponse.json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (message: string, statusCode: number = 500) => {
    return NextResponse.json(
        {
            success: false,
            message,
        },
        { status: statusCode },
    );
};

export const zodErrorResponse = (error: ZodError) => {
    const errorMessage = error.issues.map((issue) => issue.message).join(', ');
    return errorResponse(errorMessage, 400);
};
