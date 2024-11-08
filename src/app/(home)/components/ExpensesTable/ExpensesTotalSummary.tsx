import { FC } from 'react';
import { TExpenses } from '@/types/expenses';
import { calcutalateExpenses } from '@/lib/utils';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { buy, sell } from '../../static';

interface IExpensesTotalSummary {
    filteredExpenses: TExpenses[];
    activeTab: string;
}
export const ExpensesTotalSummary: FC<IExpensesTotalSummary> = ({
    filteredExpenses,
    activeTab,
}) => {
    const { totalSell, totalBuy, totalAmount, totalSellQuantity, totalBuyQuantity } =
        calcutalateExpenses(filteredExpenses);
    return (
        <Table className='my-3 bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-800 rounded'>
            <TableBody>
                <TableRow className='*:py-3 font-medium'>
                    {(activeTab.toUpperCase() === sell || activeTab === 'all') && (
                        <>
                            <TableCell colSpan={3}>
                                Total Sell Quantity {totalSellQuantity}
                            </TableCell>
                            <TableCell colSpan={3}>Total Sell {totalSell} Tk</TableCell>
                        </>
                    )}
                    {(activeTab.toUpperCase() === buy || activeTab === 'all') && (
                        <>
                            <TableCell colSpan={3}>Total Buy Quantity {totalBuyQuantity}</TableCell>
                            <TableCell colSpan={3}>Total Buy {totalBuy} Tk</TableCell>
                        </>
                    )}
                    <TableCell colSpan={3} className='text-right'>
                        Total Collection = {totalAmount} Tk
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};
