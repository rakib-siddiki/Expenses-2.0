'use server';

import { API_BASE_URL } from '@/configs/env';
import { tryCatch } from '@/http';
import { revalidatePath } from 'next/cache';
import { TSellerRespone } from '@/types/seller';
import { db } from '../api/helpers';

interface ICreateUser {
    userName: string;
    password: string;
    role: string;
}

// Create a new seller
export const createSeller = async (body: ICreateUser): Promise<TSellerRespone | undefined> => {
    try {
        const [data, err] = await tryCatch<TSellerRespone>(`${API_BASE_URL}/users`, body, {
            method: 'POST',
        });
        if (err) {
            console.error('Error creating seller:', err);
            return {
                status: false,
                message: 'Failed to create seller. Please try again later.',
                data: null,
            };
        }

        revalidatePath('/dashboard/add-seller');
        if (data) {
            return {
                status: true,
                message: 'Seller created statusfully.',
                data: data?.data,
            };
        }
    } catch (error) {
        console.error('Unexpected error in createSeller:', error);
        return {
            status: false,
            message: 'An unexpected error occurred. Please try again later.',
            data: null,
        };
    }
};

// Update a seller
export const updateSeller = async (
    id: string,
    body: ICreateUser,
): Promise<TSellerRespone | undefined> => {
    try {
        const [data, err] = await tryCatch<TSellerRespone>(`${API_BASE_URL}/users/${id}`, body, {
            method: 'PUT',
        });

        if (err) {
            console.error('Error updating seller:', err);
            return {
                status: false,
                message: 'Failed to update seller. Please try again later.',
                data: null,
            };
        }

        revalidatePath('/dashboard/add-seller');
        if (data) {
            return {
                status: true,
                message: 'Seller updated successfully.',
                data: data?.data,
            };
        }
    } catch (error) {
        console.error('Unexpected error in updateSeller:', error);
        return {
            status: false,
            message: 'An unexpected error occurred. Please try again later.',
            data: null,
        };
    }
};

// Delete a seller
export const deleteSeller = async (id: string) => {
    try {
        const existingUser = await db.user.findUnique({
            where: { id },
            include: {
                expenses: true,
            },
        });
        // Check if the user has any related expenses
        if (existingUser?.expenses && existingUser.expenses.length > 0) {
            return {
                success: false,
                message:
                    'Cannot delete item as it has related origins. Please delete the origins first.',
            };
        }
        const [data, err] = await tryCatch<TSellerRespone>(
            `${API_BASE_URL}/users/${id}`,
            undefined,
            {
                method: 'DELETE',
            },
        );

        if (err) {
            console.error('Error deleting seller:', err);
            return {
                status: false,
                message: 'Failed to delete seller. Please try again later.',
                data: null,
            };
        }

        revalidatePath('/dashboard/add-seller');
        if (data) {
            return {
                status: true,
                message: 'Seller deleted statusfully.',
                data: data?.data,
            };
        }
    } catch (error) {
        console.error('Unexpected error in deleteSeller:', error);
        return {
            status: false,
            message: 'An unexpected error occurred. Please try again later.',
            data: null,
        };
    }
};
