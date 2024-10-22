'use server';

import { API_BASE_URL } from '@/configs/env';
import { tryCatch } from '@/http';
import { getUser } from '@/http/user';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const isLoggedInAction = cache(async () => {
    const userId = cookies().get('userId')?.value;
    if (!userId || userId === '') return { isLoggedIn: false };
    const { data: user } = await getUser(userId);
    const isLoggedIn = !!user;
    if (!isLoggedIn) {
        const [res, error] = await tryCatch(`${API_BASE_URL}/logout`);
        if (res) {
            return { isLoggedIn: true };
        }
        if (error) {
            return { isLoggedIn: false };
        }
    }
    return { isLoggedIn };
});
