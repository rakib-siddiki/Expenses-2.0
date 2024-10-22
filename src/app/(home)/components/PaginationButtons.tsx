import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface IProps {
    rowsPerPage: number;
    currentPage: number;
    totalPages: number;
    handleRowsPerPageChange: (value: string) => void;
    handlePageChange: (newPage: number) => void;
}
const PaginationButtons: FC<IProps> = ({
    rowsPerPage,
    currentPage,
    totalPages,
    handleRowsPerPageChange,
    handlePageChange,
}) => {
    return (
        <div className='flex items-center justify-between my-4 max-xs:flex-col gap-3'>
            <div className='flex items-center'>
                <label htmlFor='rows-per-page' className='mr-2'>
                    Rows per page:
                </label>
                <Select onValueChange={(value) => handleRowsPerPageChange(value)}>
                    <SelectTrigger className='w-fit'>
                        <SelectValue placeholder={`${rowsPerPage}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 25, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='flex items-center'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span className='mx-2'>
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default PaginationButtons;
