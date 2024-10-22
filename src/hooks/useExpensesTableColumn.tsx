/* eslint-disable @typescript-eslint/no-misused-promises */
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { ExpensePaylaod, TExpenses, TSelectedState } from '@/types/expenses';
import { formatDate } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';
import { Icons } from '@/components/core';
import { sell } from '@/app/(home)/static';

interface IProps {
    selectedSeller: string;
    selectedOrigin: string;
    selectedItem: string;
    selectedAccount: string;
    onSelectChange: (key: keyof TSelectedState, value: string) => void;
    onDelete: (id: string) => Promise<void>;
    onEdit: (expense: ExpensePaylaod) => void;
    currentUserId: string;
    currentUserRole: 'ADMIN' | 'USER';
    loadingStates: Record<string, 'editing' | 'deleting' | undefined>;
}
const useExpensesTableColumn = ({
    selectedOrigin,
    selectedSeller,
    selectedItem,
    selectedAccount,
    onSelectChange,
    onDelete,
    onEdit,
    currentUserId,
    currentUserRole,
    loadingStates,
}: IProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<TExpenses | null>(null);
    const openDialog = (expense: TExpenses) => {
        setSelectedExpense(expense);
        setIsDialogOpen(true);
    };
    const closeDialog = () => setIsDialogOpen(false);
    const handleDelete = useCallback(async () => {
        // Call your delete function, passing the row ID
        await onDelete(selectedExpense?.id ?? '');
        closeDialog();
    }, [onDelete, selectedExpense?.id]);

    const columns: ColumnDef<TExpenses>[] = useMemo(
        () => [
            {
                accessorKey: 'sl_no',
                header: ({ column }) => {
                    return (
                        <Button
                            variant='ghost'
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            className='px-1'
                        >
                            Sl.No
                            <Icons.ArrowUpDown className='ml-2 h-4 w-4' />
                        </Button>
                    );
                },
                cell: ({ row }) => <p className='font-medium'>{row.getValue('sl_no')}</p>,
            },
            {
                accessorKey: 'seller',
                header: ({ column }) => {
                    const uniqueSellers = Array.from(
                        new Set(column.getFacetedRowModel().rows.map((row) => row.original.seller)),
                    );

                    return (
                        <SelelectAndSearch
                            className='font-bold'
                            placeholder='Seller'
                            options={uniqueSellers}
                            value={selectedSeller}
                            setValue={(value) => {
                                onSelectChange('seller', value);
                                column.setFilterValue(value || undefined);
                            }}
                        />
                    );
                },
                cell: ({ row }) => (
                    <p className='capitalize font-medium'>{row.getValue('seller')}</p>
                ),
            },
            {
                accessorKey: 'item',
                header: ({ column }) => {
                    const uniqueSellers = Array.from(
                        new Set(column.getFacetedRowModel().rows.map((row) => row.original.item)),
                    );

                    return (
                        <SelelectAndSearch
                            className='font-bold'
                            placeholder='Item'
                            options={uniqueSellers}
                            value={selectedItem}
                            setValue={(value) => {
                                onSelectChange('item', value);
                                column.setFilterValue(value || undefined);
                            }}
                        />
                    );
                },
                cell: ({ row }) => <p className='capitalize font-medium'>{row.getValue('item')}</p>,
            },
            {
                accessorKey: 'origin',
                header: ({ column }) => {
                    const uniqueOrigin = Array.from(
                        new Set(column.getFacetedRowModel().rows.map((row) => row.original.origin)),
                    );

                    return (
                        <SelelectAndSearch
                            className='font-bold'
                            placeholder='Origin'
                            options={uniqueOrigin}
                            value={selectedOrigin}
                            setValue={(value) => {
                                onSelectChange('origin', value);
                                column.setFilterValue(value || undefined);
                            }}
                        />
                    );
                },
                cell: ({ row }) => (
                    <p className='capitalize font-medium'>{row.getValue('origin')}</p>
                ),
            },
            {
                accessorKey: 'quantity',
                header: () => <h2 className='font-bold'>Quantity</h2>,
                cell: ({ row }) => <p className=' font-medium'>{row.getValue('quantity')}</p>,
            },
            {
                accessorKey: 'Accounts.accountName',
                header: ({ column }) => {
                    const uniqueAccounts = Array.from(
                        new Map(
                            column.getFacetedRowModel().rows.map((row) => [
                                row.original.Accounts.id, // Use the account id as the key
                                {
                                    id: row.original.Accounts.id,
                                    name: row.original.Accounts.accountName,
                                    balance: row.original.Accounts.balance,
                                },
                            ]),
                        ).values(),
                    );
                    return (
                        <SelelectAndSearch
                            className='font-bold'
                            placeholder='Amount'
                            options={uniqueAccounts}
                            value={selectedAccount}
                            setValue={(value) => {
                                onSelectChange('account', value);
                                column.setFilterValue(value || undefined);
                            }}
                        />
                    );
                },
                cell: ({ row }) => {
                    const isSell = row.original.type === sell;
                    const amount = row.original.amount;
                    return (
                        <p className='font-medium'>
                            {isSell ? '+' : '-'} {amount.toLocaleString()}
                            <span className='font-extrabold'>৳</span>
                        </p>
                    );
                },
            },
            {
                accessorKey: 'stock',
                header: () => <h2 className='font-bold'>Stock</h2>,
                cell: ({ row }) => {
                    const stock = Number(row.getValue('stock'));
                    return <p className=' font-medium'>{stock.toFixed(2)}</p>;
                },
            },
            {
                accessorKey: 'avgRate',
                header: () => <h2 className='font-bold text-nowrap'>Avg Rate</h2>,
                cell: ({ row }) => {
                    const value = row.getValue('avgRate');
                    const avgRateNumber = parseFloat(String(value));
                    return (
                        <p className=' font-medium'>
                            {avgRateNumber}
                            <span className='font-extrabold'>৳</span>
                        </p>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: () => <h2 className='font-bold'>Time</h2>,
                cell: ({ row }) => {
                    const time = new Date(row.getValue('createdAt'));
                    return <p className=' font-medium'>{formatDate(time)}</p>;
                },
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const id = row.original.id as string;
                    //
                    const isLoading = !!loadingStates[id];
                    return currentUserId === row.original.userId || currentUserRole === 'ADMIN' ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='h-8 w-8 p-0'>
                                        <span className='sr-only'>Open menu</span>
                                        <MoreHorizontal className='h-4 w-4' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => onEdit(row.original as ExpensePaylaod)}
                                        disabled={isLoading}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => openDialog(row.original)}
                                        disabled={isLoading}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {'Are you absolutely sure?'}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {
                                                'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
                                            }
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={closeDialog}>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    ) : (
                        <Button
                            variant='ghost'
                            className='h-8 w-8 p-0 opacity-0 pointer-events-none'
                        ></Button>
                    );
                },
            },
        ],
        [
            currentUserId,
            currentUserRole,
            handleDelete,
            isDialogOpen,
            loadingStates,
            onEdit,
            onSelectChange,
            selectedAccount,
            selectedItem,
            selectedOrigin,
            selectedSeller,
        ],
    );
    return { columns };
};

export default useExpensesTableColumn;
