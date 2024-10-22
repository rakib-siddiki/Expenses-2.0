'use server';

import { API_BASE_URL } from '@/configs/env';
import { tryCatch } from '@/http';
import { revalidatePath } from 'next/cache';
import { ItemsResponse } from '@/types/items';
import { db } from '../api/helpers';

// Add Item
export const addItemAction = async (name: string) => {
    // check if the item already exists
    const isItemExisting = await db.item.findFirst({
        where: {
            name: { equals: name, mode: 'insensitive' },
        },
    });

    if (isItemExisting) {
        return { success: false, message: 'Item already exists' };
    }

    const [res, error] = await tryCatch<ItemsResponse>(
        `${API_BASE_URL}/items`,
        { name },
        {
            method: 'POST',
        },
    );
    if (error) {
        return { success: false, message: 'Failed to add item. Please try again later.' };
    }
    revalidatePath('/dashboard/add-items');
    return {
        success: true,
        data: res?.data,
    };
};

// Get Items
export const getItemsAction = async () => {
    const [res, error] = await tryCatch<ItemsResponse>(`${API_BASE_URL}/items`);

    if (error) {
        return { success: false, message: 'Failed to fetch items. Please try again later.' };
    }
    revalidatePath('/dashboard/add-items');
    return {
        success: true,
        data: res?.data,
    };
};

// Edit (Update) Item
export const editItemAction = async (id: string, name: string) => {
    const [res, error] = await tryCatch<ItemsResponse>(
        `${API_BASE_URL}/items/${id}`,
        { name },
        {
            method: 'PUT',
        },
    );
    if (error) {
        return { success: false, message: 'Failed to update item. Please try again later.' };
    }
    revalidatePath('/dashboard/add-items');
    return {
        success: true,
        data: res?.data,
    };
};

// Delete Item
export const deleteItemAction = async (id: string) => {
    // Check if the item exists
    const existingItem = await db.item.findUnique({
        where: { id },
        include: {
            origins: true, // Include origins to check if any are associated
        },
    });
    // Check if there are any related origins
    if (existingItem?.origins && existingItem?.origins?.length > 0) {
        return {
            success: false,
            message:
                'Cannot delete item as it has related origins. Please delete the origins first.',
        };
    }

    const [res, error] = await tryCatch<ItemsResponse>(`${API_BASE_URL}/items/${id}`, undefined, {
        method: 'DELETE',
    });
    if (error) {
        return { success: false, message: 'Failed to delete item. Please try again later.' };
    }
    revalidatePath('/dashboard/add-items');
    return {
        success: true,
        message: 'Item deleted successfully',
        data: res?.data,
    };
};
