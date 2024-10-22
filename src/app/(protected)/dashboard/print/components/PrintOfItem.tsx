'use client';

import { isWithinInterval, parse, parseISO } from 'date-fns';
import React, { FC, useMemo, useState } from 'react';
import { ExpensesResponse } from '@/types/expenses';
import { Button } from '@/components/ui/button';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';
import { TableCell, TableRow } from '@/components/ui/table';
import { IItemIdAndName } from '../page';
import PrintCard from './PrintCard';

interface IItemPrintOut {
    item: string;
    quantity: number;
    totalTK: number;
}

interface IProps {
    fromDate: string;
    toDate: string;
    items: IItemIdAndName[];
    expenses: ExpensesResponse['data'];
    activeTab: string;
}

const PrintOfItem: FC<IProps> = ({ fromDate, toDate, items, expenses, activeTab }) => {
    const [selectedItem, setSelectedItem] = useState<string>('');

    // Extract unique item options
    const itemOptions = items?.map(({ name }) => name) ?? [];

    // Use useMemo to dynamically create listItems based on selected item and filters
    const listItems: IItemPrintOut[] = useMemo(() => {
        if (!selectedItem || !expenses || !activeTab) return [];

        // Parse dates using date-fns
        const parsedFromDate = parse(fromDate, 'dd-MM-yyyy', new Date());
        const parsedToDate = parse(toDate, 'dd-MM-yyyy', new Date());

        // Filter data for the selected item, active tab, and date range
        return expenses
            .filter(({ type, createdAt, item }) => {
                const expenseDate = new Date(createdAt ?? '').toLocaleDateString('en-CA');
                const parseExpenseDate = parseISO(expenseDate);
                // Ensure dates are parsed correctly and use isWithinInterval
                const isDateValid = isWithinInterval(parseExpenseDate, {
                    start: parsedFromDate,
                    end: parsedToDate,
                });
                return type === activeTab && isDateValid && item.name === selectedItem;
            })
            .map(({ item, quantity, amount }) => ({
                item: item.name,
                quantity,
                totalTK: amount,
            }));
    }, [selectedItem, expenses, activeTab, fromDate, toDate]);

    const totalQuantity = listItems.reduce((total, item) => total + item.quantity, 0);
    const totalTK = listItems.reduce((total, item) => total + item.totalTK, 0);

    return (
        <>
            <SelelectAndSearch
                options={itemOptions}
                placeholder='Select Item'
                setValue={setSelectedItem}
                value={selectedItem}
            />
            <PrintCard
                tile={`Print Of ${selectedItem}`}
                formDate={fromDate}
                toDate={toDate}
                thOption={['Item', 'Quantity', 'Total TK']}
                totalQuantity={totalQuantity}
                totalTK={totalTK}
            >
                {listItems.map((item) => (
                    <TableRow key={item.item}>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.quantity.toLocaleString()}</TableCell>
                        <TableCell>{item.totalTK.toLocaleString()}</TableCell>
                    </TableRow>
                ))}
            </PrintCard>
            <div className='flex justify-end mt-4'>
                <Button variant='outline'>Print Out</Button>
            </div>
        </>
    );
};

export default PrintOfItem;
