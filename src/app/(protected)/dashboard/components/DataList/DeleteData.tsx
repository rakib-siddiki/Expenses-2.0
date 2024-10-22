import React, { FC } from 'react';
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
import { Icons } from '@/components/core';

interface IProps {
    onDelete: (id: string) => void;
    id: string;
    title?: string;
    message?: string;
}
const DeleteData: FC<IProps> = ({ onDelete, id, title, message }) => {
    const handleDelete = (id: string) => {
        onDelete(id);
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Icons.Trash2 className='text-red-500 cursor-pointer' />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title ?? 'Are you absolutely sure?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message ??
                            'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteData;
