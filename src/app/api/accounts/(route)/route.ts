import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onCreateAccount, onFindAccounts } from '../controllers';
import { TAccountPayload } from '../types';


// Handle POST request to create a new account
export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TAccountPayload;
        const res = await onCreateAccount(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error', 500);
    }
};

// Handle GET request to fetch all accounts
export const GET = async () => {
    try {
        const res = await onFindAccounts();
        return res;
    } catch (err) {
        return errorResponse('Internal Server error', 500);
    }
};
