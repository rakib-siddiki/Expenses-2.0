import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteItem, onFindItem, onUpdateItem } from '../../controllers';
import { TItemPayload } from '../../types';

// Get Item by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const Item = await onFindItem(id);
        return Item;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update Item data by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const data = (await req.json()) as TItemPayload;
        const updatedItem = await onUpdateItem(id, data);
        return updatedItem; // Return JSON response
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete Item by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const deletedItem = await onDeleteItem(id);
        return deletedItem;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
