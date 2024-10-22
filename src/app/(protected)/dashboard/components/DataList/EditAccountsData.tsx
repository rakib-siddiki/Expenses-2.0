'use client';

import React, { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/core';
import { TAccountResponse } from '@/app/api/accounts/types';

interface EditAccountProps {
    account: TAccountResponse;
    onEdit: (updatedAccount: TAccountResponse) => void;
}

const EditAccountsData: FC<EditAccountProps> = ({ account, onEdit }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editValues, setEditValues] = useState({
        accountName: account.accountName,
        balance: account.balance,
    });

    const handleSave = () => {
        const updatedAccount = {
            ...account,
            accountName: editValues.accountName,
            balance: parseFloat(editValues.balance as unknown as string), // Ensure balance is a number
        };
        onEdit(updatedAccount);
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

            {/* Dialog for editing account */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Account</DialogTitle>
                    </DialogHeader>

                    <div className='space-y-4'>
                        {/* Input for account name */}
                        <Input
                            type='text'
                            value={editValues.accountName}
                            onChange={(e) => handleChange('accountName', e.target.value)}
                            placeholder='Edit account name'
                        />
                        {/* Input for account balance */}
                        <Input
                            type='number'
                            value={editValues.balance}
                            onChange={(e) => handleChange('balance', e.target.value)}
                            placeholder='Edit balance'
                        />
                    </div>
                    <div className='flex justify-end gap-2 mt-4'>
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

export default EditAccountsData;
