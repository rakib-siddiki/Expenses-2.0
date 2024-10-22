/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { useExpensesTableColumn } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import React, { FC, memo, useState } from 'react';
import { ExpensePaylaod, TExpenses, TSelectedState } from '@/types/expenses';
import { ItemsResponse } from '@/types/items';
import { OriginsResponse } from '@/types/origins';
import useShowToast from '@/hooks/useShowToast';
import { deleteExpenseAction, editExpenseAction } from '@/app/actions/expenses';
import { TAccountResponse } from '@/app/api/accounts/types';
import { ExpensesTableBody, ExpensesTableHeader, ExpensesTotalSummary } from '.';
import { PaginationButtons } from '..';
import { EditExpenseDialog } from '../EditExpensesDialog';
import { expensesQueryKey } from '../HomeContainer';

interface IProps {
    data: TExpenses[];
    activeTab: string;
    currentUserId: string;
    currentUserRole: 'ADMIN' | 'USER';
    items: ItemsResponse['data'] | undefined;
    origins: OriginsResponse['data'] | undefined;
    accounts: TAccountResponse[];
    isLoading: boolean;
}

const ExpensesTable: FC<IProps> = ({
    data,
    activeTab,
    currentUserId,
    currentUserRole,
    items,
    origins,
    accounts,
    isLoading,
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [loadingStates, setLoadingStates] = useState<
        Record<string, 'editing' | 'deleting' | undefined>
    >({});

    // Initialize the state with default values
    const [selectedState, setSelectedState] = useState<TSelectedState>({
        seller: '',
        origin: '',
        item: '',
        account: '',
    });
    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // edit states
    const [editingExpense, setEditingExpense] = useState<ExpensePaylaod | null>(null);
    const queryClient = useQueryClient();
    const { showToast } = useShowToast();

    // handle selected state
    const handleSelectedStateChange = (key: keyof TSelectedState, value: string) => {
        setSelectedState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleEdit = async (updatedExpense: ExpensePaylaod) => {
        const updatedExpensesId = String(updatedExpense.id);
        setLoadingStates((prev) => ({ ...prev, [updatedExpensesId]: 'editing' }));
        try {
            const response = await editExpenseAction(
                updatedExpensesId,
                updatedExpense,
                currentUserRole,
            );
            if (!response.success) {
                showToast(false, response.message ?? 'Failed to edit expense');
            } else {
                showToast(true, 'Expense updated successfully');
            }
        } finally {
            setLoadingStates((prev) => ({ ...prev, [updatedExpensesId]: undefined }));
            setEditingExpense(null);
        }
    };

    const handleDelete = async (id: string) => {
        setLoadingStates((prev) => ({ ...prev, [id]: 'deleting' }));
        try {
            queryClient.setQueryData([expensesQueryKey], (old: TExpenses[] | undefined) => {
                return old?.filter((expense) => expense.id !== id);
            });
            const response = await deleteExpenseAction(id, currentUserRole);
            if (!response.success) {
                showToast(false, response.message);
                void queryClient.invalidateQueries({ queryKey: [expensesQueryKey] });
            } else {
                showToast(true, 'Expense deleted successfully');
                void queryClient.invalidateQueries({ queryKey: [expensesQueryKey] });
            }
        } finally {
            setLoadingStates((prev) => ({ ...prev, [id]: undefined }));
        }
    };
    // get table columns
    const { columns } = useExpensesTableColumn({
        onSelectChange: handleSelectedStateChange,
        selectedOrigin: selectedState.origin,
        selectedSeller: selectedState.seller,
        selectedItem: selectedState.item,
        selectedAccount: selectedState.account,
        onDelete: handleDelete,
        onEdit: (expense: ExpensePaylaod) => setEditingExpense(expense),
        currentUserId,
        currentUserRole,
        loadingStates,
    });
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (value: string) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1);
    };
    const handleSortingChange = React.useCallback(
        (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
            setSorting(updaterOrValue);
        },
        [],
    );

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const table = useReactTable({
        data,
        columns: memoizedColumns,
        onSortingChange: handleSortingChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        pageCount: Math.ceil(data.length / rowsPerPage),
        manualPagination: false,
        state: {
            sorting,
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: rowsPerPage,
            },
        },
    });

    // Check if any filters are applied
    const isFiltered =
        selectedState.seller || selectedState.origin || selectedState.item || selectedState.account;

    // Calculate totals dynamically based on filters
    const filteredData = isFiltered
        ? table.getFilteredRowModel().rows.map((row) => row.original)
        : data;

    return (
        <div className='w-full'>
            <div className='rounded-md border h-[60dvh] overflow-y-auto no-scrollbar'>
                <table className='w-full relative caption-bottom text-sm '>
                    <ExpensesTableHeader headerGroups={table.getHeaderGroups()} />
                    <ExpensesTableBody
                        loadingStates={loadingStates}
                        rows={table.getRowModel().rows}
                        isLoading={isLoading}
                    />
                </table>
            </div>
            <ExpensesTotalSummary filteredExpenses={filteredData} activeTab={activeTab} />
            {/* Bottom pagination section */}
            <PaginationButtons
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                handleRowsPerPageChange={handleRowsPerPageChange}
                handlePageChange={handlePageChange}
            />
            {/* Bottom editingExpense section */}
            {editingExpense && (
                <EditExpenseDialog
                    editingExpense={editingExpense}
                    onEdit={handleEdit}
                    items={items}
                    origins={origins}
                    accounts={accounts}
                    currentUserRole={currentUserRole}
                    onClose={() => setEditingExpense(null)}
                />
            )}
        </div>
    );
};
export default memo(ExpensesTable);
