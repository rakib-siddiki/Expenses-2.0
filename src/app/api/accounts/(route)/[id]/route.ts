import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onFindAccount, onUpdateAccount, onDeleteAccount } from '../../controllers';
import { TAccountPayload } from '../../types';


// Get Account by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const account = await onFindAccount(id);
        return account;
    } catch (err) {
        return errorResponse('Internal server error', 500);
    }
};

// Update Account data by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const data = (await req.json()) as TAccountPayload;
        const updatedAccount = await onUpdateAccount(id, data);
        return updatedAccount; // Return JSON response
    } catch (err) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete Account by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params; // Extract ID from params
        const deletedAccount = await onDeleteAccount(id);
        return deletedAccount;
    } catch (err) {
        return errorResponse('Internal server error', 500);
    }
};
