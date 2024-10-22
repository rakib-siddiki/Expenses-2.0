import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onCreateOrigin, onFindOrigins } from '../controllers';
import { TOriginPayload } from '../types';

// Handle POST request to create a new origin
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TOriginPayload;
        const res = await onCreateOrigin(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Handle GET request to fetch all origins
export const GET = async () => {
    try {
        const res = await onFindOrigins();
        return res;
    } catch (err) {
        return errorResponse('Internal Server error');
    }
};
