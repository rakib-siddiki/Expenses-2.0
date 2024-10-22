import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteOrigin, onFindOrigin, onUpdateOrigin } from '../../controllers';
import { TOriginPayload } from '../../types';

// Get Origin by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const Origin = await onFindOrigin(id);
        return Origin;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update Origin data by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const data = (await req.json()) as TOriginPayload;
        const updatedOrigin = await onUpdateOrigin(id, data);
        return updatedOrigin; // Return JSON response
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete Origin by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const deletedOrigin = await onDeleteOrigin(id);
        return deletedOrigin;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
