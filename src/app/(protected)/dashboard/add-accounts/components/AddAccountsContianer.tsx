/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import React, { FC, useState } from 'react';
import { z } from 'zod';
import useShowToast from '@/hooks/useShowToast';
import { FormFieldConfig } from '@/components/ui/CustomForm/CustomForm';
import { addAccaunts, deleteAccount, editAccount } from '@/app/actions/accounts';
import { TAccountPayload, TAccountResponse } from '@/app/api/accounts/types';
import { AddOptions, DataList } from '../../components';
import { TListItem } from '../../components/DataList/DataList';

interface IProps {
    data: TAccountResponse[];
}

const ADD_ACCOUNTS_FORM_FIELDS: FormFieldConfig[] = [
    {
        name: 'accountName',
        fieldType: 'input',
        validation: z.string().min(1, { message: 'Please enter the account name.' }),
        placeholder: 'Enter the account name',
        type: 'text',
    },
    {
        name: 'balance',
        fieldType: 'input',
        validation: z
            .number()
            .nonnegative()
            .min(0, { message: 'Balance must be a non-negative number.' }),
        placeholder: 'Enter the balance amount',
        type: 'number',
    },
];

const AddAccountsContianer: FC<IProps> = ({ data }) => {
    const [accountsData, setAccountsData] = useState(data);
    const { showToast } = useShowToast();

    // Handle adding a new account
    const handleAdd = async (val: Record<string, unknown>) => {
        const newAccount: TAccountResponse = {
            id: `${Date.now()}`,
            accountName: val.accountName as string,
            balance: val.balance as number,
        };

        setAccountsData((prevData) => [...prevData, newAccount]);

        try {
            const response = await addAccaunts(val as TAccountPayload);
            if (!response?.success) {
                setAccountsData((prevData) =>
                    prevData.filter((account) => account.id !== newAccount.id),
                );
                showToast(false, response?.message ?? 'Failed to add account.');
                return;
            }
            showToast(true, 'Account added successfully');
            setAccountsData((prevData) =>
                prevData.map((account) =>
                    account.id === newAccount.id ? (response.data as TAccountResponse) : account,
                ),
            );
        } catch (error) {
            setAccountsData((prevData) =>
                prevData.filter((account) => account.id !== newAccount.id),
            );
            showToast(false, 'Failed to add account.');
        }
    };

    // Handle deleting an account
    const handleDelete = async (id: string) => {
        const originalData = [...accountsData];
        setAccountsData((prevData) => prevData.filter((account) => account.id !== id));

        try {
            const response = await deleteAccount(id);
            if (!response?.success) {
                setAccountsData(originalData);
                showToast(false, response?.message ?? 'Failed to delete account.');
                return;
            }
            showToast(true, 'Account deleted successfully');
        } catch (error) {
            setAccountsData(originalData);
            showToast(false, 'Failed to delete account.');
        }
    };

    // Handle editing an account
    const handleEdit = async (payload: TListItem) => {
        if ('accountName' in payload) {
            const originalData = [...accountsData];
            setAccountsData((prevData) =>
                prevData.map((account) => (account.id === payload.id ? payload : account)),
            );

            try {
                const response = await editAccount(payload.id, payload);
                if (!response?.success) {
                    setAccountsData(originalData);
                    showToast(false, response?.message ?? 'Failed to update account.');
                    return;
                }
                showToast(true, 'Account updated successfully');
                // Optimistically update the UI
                setAccountsData((prevData) =>
                    prevData.map((account) => (account.id === payload.id ? payload : account)),
                );
            } catch (error) {
                setAccountsData(originalData);
                showToast(false, 'Failed to update account.');
            }
        }
    };

    return (
        <section className='space-y-5 sm:space-y-10'>
            <AddOptions fromFields={ADD_ACCOUNTS_FORM_FIELDS} onHandleSubmit={handleAdd} />
            <DataList
                CardContainerClass='grid grid-cols-3'
                heading='List of accounts'
                data={accountsData}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </section>
    );
};

export default AddAccountsContianer;
