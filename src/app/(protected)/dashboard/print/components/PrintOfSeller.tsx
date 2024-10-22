/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { FC, useState } from 'react';
import { ExpensesResponse } from '@/types/expenses';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';
import { TableCell, TableRow } from '@/components/ui/table';
import { useSellerLogicsForPrintPage } from '../hooks';
import { IItemIdAndName, IUserIdAndName } from '../page';
import PrintCard from './PrintCard';

interface IProps {
    fromDate: string;
    toDate: string;
    seller: IUserIdAndName[];
    items: IItemIdAndName[];
    expenses: ExpensesResponse['data'];
    activeTab: string;
}

const PrintOfSeller: FC<IProps> = ({ fromDate, toDate, seller, items, expenses, activeTab }) => {
    const [sellectedSeller, setSellectedSeller] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string>('');

    const { sellerOptions, itemOptions, listItems, totalQuantity, totalTK } =
        useSellerLogicsForPrintPage({
            fromDate,
            toDate,
            seller,
            items,
            expenses,
            activeTab,
            selectedItem,
            sellectedSeller,
        });

    // Determine table headers based on selected seller and item
    const tableHeaders = selectedItem
        ? ['Origin', 'Quantity', 'Total TK']
        : ['Item', 'Quantity', 'Total TK'];

    // Function to handle printing or saving as PDF
    const handlePrintOrSavePDF = async () => {
        const input = document.getElementById('printCard');
        const total = document.getElementById('total');
        const printCardContainer = document.getElementById('printCardContainer');
        if (input) {
            if (total) {
                total.style.border = 'none';
            }

            if (printCardContainer) {
                printCardContainer.style.border = 'none';
            }
            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL('image/png');
            // Restore borders after capturing
            if (total) {
                total.style.border = '';
            }
            if (printCardContainer) {
                printCardContainer.style.border = '';
            }
            // Create a new jsPDF instance with A4 size
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Calculate dimensions for A4 page size
            const imgWidth = 210; // width of A4 in mm
            const pageHeight = 297; // height of A4 in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add image to PDF and handle multi-page if necessary
            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                if (heightLeft > 0) {
                    position -= pageHeight;
                    pdf.addPage();
                }
            }

            pdf.save(`printout-${sellectedSeller}.pdf`);
        }
    };

    return (
        <>
            <SelelectAndSearch
                options={sellerOptions}
                placeholder='Select Seller'
                setValue={setSellectedSeller}
                value={sellectedSeller}
            />
            <SelelectAndSearch
                options={itemOptions}
                placeholder='Select Item'
                setValue={setSelectedItem}
                value={selectedItem}
                className='ml-4'
                disabled={sellectedSeller === ''}
            />
            <div id='printCard'>
                <PrintCard
                    tile={`Print Of ${sellectedSeller}`}
                    formDate={fromDate}
                    toDate={toDate}
                    thOption={tableHeaders} // Dynamically set table headers
                    totalQuantity={totalQuantity}
                    totalTK={totalTK}
                >
                    {listItems.map(({ item, origin, quantity, totalTK }) => (
                        <TableRow key={`${item}-${origin ?? ''}`}>
                            <>
                                <TableCell>
                                    {selectedItem
                                        ? origin?.toLocaleString()
                                        : item.toLocaleString()}
                                </TableCell>
                                <TableCell>{quantity.toLocaleString()}</TableCell>
                                <TableCell>{totalTK.toLocaleString()}</TableCell>
                            </>
                        </TableRow>
                    ))}
                </PrintCard>
            </div>
            <div className='flex justify-end mt-4'>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='outline'>Print Out</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Do you want to save as PDF?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will save your table data as a PDF file.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handlePrintOrSavePDF}>
                                Save
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
};

export default PrintOfSeller;
