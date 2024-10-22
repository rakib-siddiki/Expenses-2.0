/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { useQueryClient } from '@tanstack/react-query';
import React, { FC, useState } from 'react';
import { z } from 'zod';
import { ExpensePaylaod } from '@/types/expenses';
import { ItemsResponse } from '@/types/items';
import { OriginsResponse } from '@/types/origins';
import { TSeller } from '@/types/seller';
import useShowToast from '@/hooks/useShowToast';
import { Button } from '@/components/ui/button';
import CustomForm, { FormFieldConfig } from '@/components/ui/CustomForm/CustomForm';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { addExpenseAction } from '@/app/actions/expenses';
import { TAccountResponse } from '@/app/api/accounts/types';
import { expensesQueryKey } from './HomeContainer';

interface IProps {
    activeTab: string;
    items: ItemsResponse['data'] | undefined;
    origins: OriginsResponse['data'] | undefined;
    accounts: TAccountResponse[];
    user: TSeller | null;
}

const AddExpenses: FC<IProps> = ({ activeTab, items, origins, accounts, user }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { showToast } = useShowToast();
    const filteredOrigins =
        origins?.filter((origin) => origin?.item.name === selectedItem)?.map(({ name }) => name) ||
        [];

    const accountsOptions = accounts?.map((account) => ({
        id: account.id,
        name: account.accountName,
        balance: account.balance,
    }));
    const FORM_FIELDS: FormFieldConfig[] = [
        {
            name: 'seller',
            fieldType: 'input',
            validation: z.string().min(0, { message: 'Please select a seller.' }),
            label: 'Seller',
            readOnly: true,
            value: user?.userName ?? '',
            tabIndex: -1,
        },
        {
            name: 'type',
            fieldType: 'select',
            options: ['sell', 'buy'],
            validation: z
                .string()
                .min(1, { message: 'Please select a type where you want to add.' }),
            label: 'Select Type Buy/Sell Default Is Sell',
            placeholder: 'Select a type',
            value: 'sell',
            isComboSelect: false,
        },
        {
            name: 'item',
            fieldType: 'select',
            options: items,
            validation: z.string().min(1, { message: 'Please select an item.' }),
            label: 'Item',
            placeholder: 'Select an item',
            onSelectChange: (value: string) => setSelectedItem(value),
        },
        {
            name: 'origin',
            fieldType: 'select',
            options: filteredOrigins,
            validation: z.string().min(1, { message: 'Please select the origin.' }),
            label: 'Origin',
            placeholder: 'Select the origin',
            disabled: !selectedItem,
        },
        {
            name: 'account',
            fieldType: 'select',
            options: accountsOptions,
            validation: z.string().min(1, { message: 'Please select an account.' }),
            label: 'Account',
            placeholder: 'Select the account',
        },
        {
            name: 'quantity',
            fieldType: 'input',
            validation: z
                .number()
                .nonnegative()
                .min(0, { message: 'Quantity must be a non-negative number.' }),
            label: 'Quantity',
            placeholder: 'Enter the quantity',
            type: 'number',
        },
        {
            name: 'amount',
            fieldType: 'input',
            validation: z
                .number()
                .nonnegative()
                .min(0, { message: 'Amount must be a non-negative number.' }),
            label: 'Amount',
            placeholder: 'Enter the amount',
            type: 'number',
        },
    ];

    const handleSubmit = async (value: Record<string, unknown>) => {
        console.log('🚀 > file: AddExpenses.tsx:119 > handleSubmit > value:', value);
        setIsDialogOpen(false);
        const itemId =
            items?.find(({ name }) => name.toLowerCase() === String(value.item).toLowerCase())
                ?.id ?? '';

        const originId =
            origins?.find(({ name }) => name.toLowerCase() === String(value.origin).toLowerCase())
                ?.id ?? '';

        const accountId =
            accounts?.find(
                ({ accountName }) =>
                    accountName.toLowerCase() === String(value.account).toLowerCase(),
            )?.id ?? '';

        const expensePayload: ExpensePaylaod = {
            userId: user?.id ?? '',
            type: String(value.type).toUpperCase() as 'BUY' | 'SELL',
            itemId,
            originId,
            accountId,
            amount: Number(value.amount),
            quantity: Number(value.quantity),
        };
        // Optimistic update
        const previousExpenses = queryClient.getQueryData<ExpensePaylaod[]>([expensesQueryKey]);

        // Update cache optimistically
        queryClient.setQueryData([expensesQueryKey], (old: ExpensePaylaod[] | undefined) => [
            ...(old || []),
            expensePayload,
        ]);
        try {
            const res = await addExpenseAction(expensePayload);
            if (!res.success) {
                queryClient.setQueryData([expensesQueryKey], previousExpenses);
                showToast(false, res?.message ?? 'Something went wrong');
            } else {
                showToast(true, 'Expense Added Successfully');
                void queryClient.invalidateQueries({ queryKey: [expensesQueryKey] });
            }
        } catch (error) {
            queryClient.setQueryData([expensesQueryKey], previousExpenses);
            showToast(false, 'Something went wrong');
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className='capitalize inline-block text-xs px-2 py-1'>Add Expense</Button>
            </DialogTrigger>
            <DialogTitle className='sr-only'>this is for addding {activeTab} expenses</DialogTitle>
            <DialogDescription className='sr-only'>
                this is for addding {activeTab} expenses
            </DialogDescription>
            <DialogContent className=''>
                <CustomForm onSubmit={handleSubmit} fields={FORM_FIELDS} />
            </DialogContent>
        </Dialog>
    );
};

export default AddExpenses;
