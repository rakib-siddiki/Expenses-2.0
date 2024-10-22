import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onUpdateStock } from '../../controllers';
import { TStockPayload } from '../../types';

// Update Stock data by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const data = (await req.json()) as TStockPayload;
        const updatedStock = await onUpdateStock(id, data);
        return updatedStock; // Return JSON response
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
