'use client';

import React, { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/core';

interface IItem {
    id: string;
    name: string;
}

interface EditUserDataProps {
    item: IItem;
    onEdit: (updateditem: IItem) => void;
}

const EditItemsData: FC<EditUserDataProps> = ({ item, onEdit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editValues, setEditValues] = useState({ name: item.name });

    const handleSave = () => {
        const updateditem = { ...item, name: editValues.name };
        onEdit(updateditem);
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

                    <Input
                        type='text'
                        value={editValues.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className='mb-4'
                        placeholder='Edit username'
                    />
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

export default EditItemsData;
