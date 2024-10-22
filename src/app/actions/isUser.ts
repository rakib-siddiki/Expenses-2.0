'use server';

import { getUser } from '@/http/user';
import { cookies } from 'next/headers';

export const isUser = async () => {
    const userId = cookies().get('userId')?.value;
    const { data: user } = await getUser(userId as string);
    return user;
};
