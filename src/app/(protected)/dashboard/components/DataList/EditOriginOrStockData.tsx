'use client';

import React, { FC, useState } from 'react';
import { Item } from '@/types/items';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SelelectAndSearch } from '@/components/ui/selectAndSerch';
import { Icons } from '@/components/core';

interface IData {
    id: string;
    item: string;
    origin: string;
    stock?: number;
}

interface EditOriginAndStockDataProps {
    data: IData;
    onEdit: (updatedUser: IData) => void;
    itemOptions?: Item[];
    originOptions?: Item[];
    isStockPage?: boolean;
}

const EditOriginOrStockData: FC<EditOriginAndStockDataProps> = ({
    data,
    onEdit,
    itemOptions,
    originOptions,
    isStockPage,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editValues, setEditValues] = useState({
        item: itemOptions?.find((i) => i.id === data.item || i.name === data.item)?.name ?? '',
        origin: data.origin,
        stock: data.stock ?? 0,
    });

    const handleSave = () => {
        const updatedData = {
            ...data,
            item: editValues.item,
            origin: editValues.origin,
            stock: editValues.stock,
        };
        onEdit(updatedData);
        setIsDialogOpen(false); // Close dialog after saving
    };

    const handleChange = (key: string, value: string) => {
        setEditValues((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className='flex gap-2 items-center'>
            {/* Edit Icon to trigger dialog */}
            <Icons.Pencil
                className='text-blue-500 cursor-pointer'
                onClick={() => setIsDialogOpen(true)}
            />

            {/* Dialog for editing user */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className='sr-only'> Edit Item </DialogDescription>
                    <SelelectAndSearch
                        options={itemOptions ?? []}
                        value={editValues.item}
                        setValue={(value) => handleChange('item', value)}
                        className='mb-4 px-3 border border-border '
                        placeholder='Select item'
                    />
                    {originOptions && isStockPage ? (
                        <SelelectAndSearch
                            options={originOptions ?? []}
                            value={editValues.origin}
                            setValue={(value) => handleChange('origin', value)}
                            className='mb-4 px-3 border border-border'
                            placeholder='Select origin'
                        />
                    ) : null}
                    {isStockPage ? (
                        <Input
                            type='number'
                            value={editValues.stock}
                            onChange={(e) => handleChange('stock', e.target.value)}
                            className='mb-4'
                            placeholder='Edit stock'
                        />
                    ) : (
                        <Input
                            type='text'
                            value={editValues.origin}
                            onChange={(e) => handleChange('origin', e.target.value)}
                            className='mb-4'
                            placeholder='Edit origin'
                        />
                    )}
                    <div className='flex justify-end gap-2'>
                        <button
                            className='px-4 py-2 bg-gray-200 text-gray-700 rounded'
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded'
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditOriginOrStockData;
