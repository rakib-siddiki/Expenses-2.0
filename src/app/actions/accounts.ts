'use server';

import { API_BASE_URL } from '@/configs/env';
import { tryCatch } from '@/http';
import { revalidatePath } from 'next/cache';
import { TAccountPayload, TAccountResponse } from '../api/accounts/types';


export type TAccount = { data: TAccountResponse[]; success: boolean; message: string };
type TAddAccount = { success: boolean; message: string; data: TAccountResponse};
export const addAccaunts = async (payload: TAccountPayload) => {
    const [data, error] = await tryCatch<TAddAccount>(`${API_BASE_URL}/accounts`, payload, {
        method: 'POST',
    });
    revalidatePath('/dashboard/add-accounts');
    if (error) {
        return { success: false, message: error.message, data: [] };
    }
    return data;
};

export const getAccounts = async () => {
    const [response, error] = await tryCatch<TAccount>(`${API_BASE_URL}/accounts`);
    if (error) {
        return { success: false, message: error.message };
    }
    revalidatePath('/dashboard/add-accounts');
    const data = response?.data;
    return data;
};

export const deleteAccount = async (id: string) => {
    const [response, error] = await tryCatch<TAccount>(`${API_BASE_URL}/accounts/${id}`, null, {
        method: 'DELETE',
    });
    revalidatePath('/dashboard/add-accounts');
    if (error) {
        return { success: false, message: error.message };
    }
    return response;
};

export const editAccount = async (id: string, payload: TAccountPayload) => {
    const [response, error] = await tryCatch<TAccount>(`${API_BASE_URL}/accounts/${id}`, payload, {
        method: 'PUT',
    });
    revalidatePath('/dashboard/add-accounts');
    if (error) {
        return { success: false, message: error.message };
    }
    return response;
};