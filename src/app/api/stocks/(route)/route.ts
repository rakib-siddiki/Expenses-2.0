import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onCreateStock, onFindStocks } from '../controllers';
import { TStockPayload } from '../types';

// Handle POST request to create a new stock entry
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TStockPayload;
        const res = await onCreateStock(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Handle GET request to fetch all stock entries
export const GET = async () => {
    try {
        const res = await onFindStocks();
        return res;
    } catch (err) {
        return errorResponse('Internal Server error');
    }
};
