import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onDeleteUser, onFindUser, onUpdateUser } from '../../controllers';
import { TUserPayload } from '../../types';

// Get user by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const user = await onFindUser(id);
        return user;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Update user data by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const data = (await req.json()) as TUserPayload;
        const updatedUser = await onUpdateUser(id, data);
        return updatedUser; // Return JSON response
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

// Delete user by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const deletedUser = await onDeleteUser(id);
        return deletedUser;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};
