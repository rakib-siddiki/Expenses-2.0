import { API_BASE_URL } from '@/configs/env';
import { cache } from 'react';
import { TSeller } from '@/types/seller';
import { tryCatch } from '..';

type TSellerRespones = {
    status: boolean;
    message: string;
    data: TSeller[] | null;
};
type TSellerByIdRespone = {
    status: boolean;
    message: string;
    data: TSeller | null;
};
export const getAllSeller = async () => {
    const [data, err] = await tryCatch<TSellerRespones>(`${API_BASE_URL}/users`);
    if (err) {
        return {
            success: false,
            message: 'Failed to fetch sellers. Please try again later.',
            data: [],
        };
    }

    // Ensure the data is in the expected format
    if ((data?.data as TSeller[])?.length > 0 && (!data || !Array.isArray(data.data))) {
        throw new Error('Unexpected response format');
    }
    return data;
};

export const getUser = cache(async (id: string) => {
    const [data, err] = await tryCatch<TSellerByIdRespone>(`${API_BASE_URL}/users/${id}`);
    if (err) {
        return {
            success: false,
            message: 'Failed to fetch sellers. Please try again later.',
            data: null,
        };
    }

    // Ensure the data is in the expected format
    if (!data?.data) {
        return {
            success: false,
            message: 'Failed to fetch user. Please try again later.',
            data: null,
        };
    }
    return data;
});
