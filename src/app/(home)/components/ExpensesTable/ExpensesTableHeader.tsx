import { flexRender, HeaderGroup } from '@tanstack/react-table';
import { FC } from 'react';
import { TExpenses } from '@/types/expenses';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface IExpensesTableHeader {
    headerGroups: HeaderGroup<TExpenses>[];
}
export const ExpensesTableHeader: FC<IExpensesTableHeader> = ({ headerGroups }) => {
    return (
        <TableHeader className='sticky top-0 bg-primary-foreground z-50'>
            {headerGroups.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                </TableRow>
            ))}
        </TableHeader>
    );
};
