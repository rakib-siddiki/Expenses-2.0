import { flexRender, Row } from '@tanstack/react-table';
import { FC } from 'react';
import { TExpenses } from '@/types/expenses';
import { cn } from '@/lib/utils';
import ClassicLoader from '@/components/ui/classic-loader';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { buy } from '../../static';
import NoDataToShow from '../NoDataToShow';

interface IExpensesTableBody {
    rows: Row<TExpenses>[];
    loadingStates: {
        [key: string]: 'editing' | 'deleting' | undefined;
    };
    isLoading: boolean;
}
export const ExpensesTableBody: FC<IExpensesTableBody> = ({ rows, loadingStates, isLoading }) => {
    return (
        <TableBody>
            {rows.length > 0 ? (
                rows.map((row) => {
                    const id = row.original.id as string;
                    const editOrDeleteisLoading = loadingStates[id];
                    return (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                            className={cn(
                                row.original.type.toUpperCase() === buy
                                    ? 'bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-900'
                                    : 'bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-900',
                                {
                                    'animate-pulse opacity-100': editOrDeleteisLoading,
                                },
                            )}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                })
            ) : (
                <>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={10} className='h-full'>
                                <div className='h-[55dvh] w-full grid place-items-center'>
                                    <ClassicLoader />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoading && rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={10} className='h-24 text-center'>
                                <NoDataToShow message='No Data To Show' className='min-h-[55vh]' />
                            </TableCell>
                        </TableRow>
                    )}
                </>
            )}
        </TableBody>
    );
};
