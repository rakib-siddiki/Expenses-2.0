import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onCreateItem, onFindItems } from '../controllers';
import { TItemPayload } from '../types';

// Handle POST request to create a new item
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TItemPayload;
        const res = await onCreateItem(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Handle GET request to fetch all items
export const GET = async () => {
    try {
        const res = await onFindItems();
        return res;
    } catch (err) {
        return errorResponse('Internal Server error');
    }
};
