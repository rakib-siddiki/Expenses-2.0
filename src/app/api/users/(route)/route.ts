import { NextRequest } from 'next/server';
import { errorResponse } from '@/app/api/helpers';
import { onCreateUser, onFindUsers } from '../controllers';
import { TUserPayload } from '../types';

export const POST = async (req: NextRequest) => {
    try {
        const body = (await req.json()) as TUserPayload;
        const res = await onCreateUser(body);
        return res;
    } catch (err) {
        return errorResponse('Internal server error');
    }
};

export const GET = async () => {
    try {
        const res = await onFindUsers();
        return res;
    } catch (err) {
        return errorResponse('Internal Server error');
    }
};
