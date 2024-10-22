/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { useQueryClient } from '@tanstack/react-query';
import React, { FC, useEffect, useState } from 'react';
import { z } from 'zod';
import { ExpensePaylaod } from '@/types/expenses';
import { ItemsResponse } from '@/types/items';
import { OriginsResponse } from '@/types/origins';
import useShowToast from '@/hooks/useShowToast';
import CustomForm, { FormFieldConfig } from '@/components/ui/CustomForm/CustomForm';
import { editExpenseAction } from '@/app/actions/expenses';
import { TAccountResponse } from '@/app/api/accounts/types';
import { expensesQueryKey } from './HomeContainer';

interface EditExpenseFormProps {
    expense: ExpensePaylaod;
    onEdit: (updatedExpense: ExpensePaylaod) => Promise<void>;
    items: ItemsResponse['data'] | undefined;
    origins: OriginsResponse['data'] | undefined;
    accounts: TAccountResponse[];
    onClose: () => void;
    currentUserRole: 'ADMIN' | 'USER';
}

const EditExpenseForm: FC<EditExpenseFormProps> = ({
    expense,
    onEdit,
    items = [],
    origins = [],
    accounts = [],
    onClose,
    currentUserRole,
}) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { showToast } = useShowToast();

    useEffect(() => {
        setSelectedItem(items?.find((item) => item.id === expense.itemId)?.name ?? null);
    }, [expense, items]);

    const filteredOrigins =
        origins?.filter((origin) => origin?.item.name === selectedItem)?.map(({ name }) => name) ||
        [];

    const accountsOptions = accounts?.map((account) => ({
        id: account.id,
        name: account.accountName,
        balance: account.balance,
    }));
    const findAccount = accountsOptions?.find((account) => account.id === expense.accountId);
    const FORM_FIELDS: FormFieldConfig[] = [
        {
            name: 'type',
            fieldType: 'select',
            options: ['SELL', 'BUY'],
            validation: z.enum(['SELL', 'BUY']),
            label: 'Type',
            placeholder: 'Select a type',
            value: expense.type,
            isComboSelect: false,
        },
        {
            name: 'item',
            fieldType: 'select',
            options: items?.map((item) => item.name) ?? [],
            validation: z.string().min(1, { message: 'Please select an item.' }),
            label: 'Item',
            placeholder: 'Select an item',
            value: items?.find((item) => item.id === expense.itemId)?.name,
            onSelectChange: (value: string) => setSelectedItem(value),
        },
        {
            name: 'origin',
            fieldType: 'select',
            options: filteredOrigins,
            validation: z.string().min(1, { message: 'Please select the origin.' }),
            label: 'Origin',
            placeholder: 'Select the origin',
            value: origins?.find((origin) => origin.id === expense.originId)?.name,
            disabled: !selectedItem,
        },
        {
            name: 'account',
            fieldType: 'select',
            options: accountsOptions,
            validation: z.string().min(1, { message: 'Please select an account.' }),
            label: 'Account',
            value: findAccount?.name,
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
            value: Number(expense.quantity) as unknown as string,
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
            value: expense.amount as unknown as string,
        },
    ];

    const handleSubmit = async (value: Record<string, unknown>) => {
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
        const updatedExpense: ExpensePaylaod = {
            ...expense,
            type: String(value.type) as 'BUY' | 'SELL',
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
            updatedExpense,
        ]);

        try {
            const res = await editExpenseAction(expense.id ?? '', updatedExpense, currentUserRole);
            if (!res.success) {
                queryClient.setQueryData([expensesQueryKey], previousExpenses);
                showToast(false, res?.message ?? 'Something went wrong');
            } else {
                void queryClient.invalidateQueries({ queryKey: [expensesQueryKey] });
                showToast(true, 'Expense Updated Successfully');
                void onEdit(updatedExpense);
            }
        } catch (error) {
            void queryClient.invalidateQueries({ queryKey: [expensesQueryKey] });
            showToast(false, 'Something went wrong');
        } finally {
            onClose();
        }
    };

    return <CustomForm onSubmit={handleSubmit} fields={FORM_FIELDS} />;
};

export default EditExpenseForm;
