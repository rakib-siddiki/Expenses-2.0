import React, { FC } from 'react';
import { TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface IPrintCard {
    tile: string;
    formDate: string;
    toDate: string;
    totalQuantity: number;
    totalTK: number;
    children: React.ReactNode;
    thOption: string[];
}

const PrintCard: FC<IPrintCard> = ({
    tile,
    formDate,
    toDate,
    totalQuantity,
    totalTK,
    children,
    thOption,
}) => {
    return (
        <div className='border border-border rounded-lg p-4 mt-6' id='printCardContainer'>
            <h2 className='text-xl font-semibold text-center mb-2 capitalize'>{tile}</h2>
            <p className='text-sm text-gray-500 text-center mb-4'>
                {formDate} To {toDate}
            </p>
            <div className='h-[35vh] overflow-y-auto no-scrollbar'>
                <table className='w-full caption-bottom text-sm'>
                    <TableHeader className='[position:sticky] top-0 bg-primary-foreground z-50'>
                        <TableRow>
                            {thOption.map((header) => (
                                <TableHead key={header}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>{children}</TableBody>
                </table>
            </div>
            <div className='flex  md:justify-end mt-4 max-md:w-full'>
                <div
                    className='border border-gray-300 px-4 py-2 rounded max-md:w-full flex justify-between items-center'
                    id='total'
                >
                    <p className='font-semibold mr-4'>Total Quantity</p>
                    <p>{totalQuantity.toLocaleString()}</p>
                    <br className='md:hidden' />
                    <p className='font-semibold md:ml-8 mr-4'>Total TK</p>
                    <p>{totalTK.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default PrintCard;
