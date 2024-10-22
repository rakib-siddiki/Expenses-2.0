'use server';

import { API_BASE_URL } from '@/configs/env';
import { tryCatch } from '@/http';
import { revalidatePath } from 'next/cache';
import { OriginsResponse } from '@/types/origins';
import { db } from '../api/helpers';

// Add Origin
export const addOriginAction = async (name: string, itemId: string) => {
    // Check if the origin already exists for the same item
    const isOriginExisting = await db.origin.findFirst({
        where: {
            OR: [
                { name: { equals: name, mode: 'insensitive' } },
                { name: { equals: name, mode: 'insensitive' }, itemId: itemId },
            ],
        },
    });

    if (isOriginExisting) {
        return { success: false, message: 'Origin already exists for this item or name' };
    }

    const [res, error] = await tryCatch<OriginsResponse>(
        `${API_BASE_URL}/origins`,
        { name, itemId },
        {
            method: 'POST',
        },
    );

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/dashboard/add-origins');
    return {
        success: true,
        data: res?.data,
    };
};
// Get Origins
export const getOriginsAction = async () => {
    const [res, error] = await tryCatch<OriginsResponse>(`${API_BASE_URL}/origins`);
    if (error) {
        return { success: false, message: 'Failed to fetch origins. Please try again later.' };
    }
    revalidatePath('/dashboard/add-origins');
    return {
        success: true,
        data: res?.data,
    };
};

// Edit (Update) Origin
export const editOriginAction = async (id: string, name: string, itemId: string) => {
    const [res, error] = await tryCatch<OriginsResponse>(
        `${API_BASE_URL}/origins/${id}`,
        { name, itemId },
        {
            method: 'PUT',
        },
    );
    if (error) {
        return { success: false, message: 'Failed to update origin. Please try again later.' };
    }
    revalidatePath('/dashboard/add-origins');
    return {
        success: true,
        data: res?.data,
    };
};

// Delete Origin
export const deleteOriginAction = async (id: string) => {
    const [res, error] = await tryCatch<OriginsResponse>(
        `${API_BASE_URL}/origins/${id}`,
        undefined,
        {
            method: 'DELETE',
        },
    );
    if (error) {
        return { success: false, message: 'Failed to delete origin. Please try again later.' };
    }
    revalidatePath('/dashboard/add-origins');
    return {
        success: true,
        message: 'Origin deleted successfully',
        data: res?.data,
    };
};
