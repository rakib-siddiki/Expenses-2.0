/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import React, { FC, useState } from 'react';
import { toast } from 'sonner';
import { TSeller } from '@/types/seller';
import { createSeller, deleteSeller, updateSeller } from '@/app/actions/user';
import { AddOptions } from '../components';
import { DataList } from '../components/DataList';
import { TListItem } from '../components/DataList/DataList';
import { ADD_SELLER_FORM_FIELDS } from '../static';

interface IProps {
    data: TSeller[] | null;
}
const showToast = (success: boolean, message: string) => {
    success
        ? toast.success(message, { duration: 1100 })
        : toast.error(message, { duration: 1100, richColors: true });
};
const AddSellerContainer: FC<IProps> = ({ data }) => {
    // State to store seller data for optimistic updates
    const [sellerData, setSellerData] = useState<TListItem[]>(
        data
            ?.filter((user) => user.role !== 'ADMIN')
            .map((user) => ({
                id: user.id,
                name: user.userName,
                password: user.password,
            })) ?? [],
    );

    // Handler for adding a new seller
    const handleAdd = async (val: Record<string, unknown>) => {
        const newSeller = {
            id: Date.now().toString(), // Temporary ID for optimistic update
            name: val.name as string,
            password: val.password as string,
        };

        // Optimistically add the new seller to the UI
        setSellerData((prevData) => [...prevData, newSeller]);

        const body = {
            userName: newSeller.name,
            password: newSeller.password,
            role: 'USER',
        };

        const response = await createSeller(body);
        if (!response?.status) {
            setSellerData((prevData) => prevData.filter((seller) => seller.id !== newSeller.id));
            showToast(false, response?.message ?? 'Failed to add seller');
        } else {
            // Update the temporary ID with the real one from the server
            setSellerData((prevData) =>
                prevData.map((seller) =>
                    seller.id === newSeller.id
                        ? { ...seller, id: response?.data?.id as string }
                        : seller,
                ),
            );
            showToast(true, response?.message);
        }
    };

    // Handler for deleting a seller
    const handleDelete = async (id: string) => {
        // Optimistically remove the seller from the UI
        const previousData = sellerData;
        setSellerData((prevData) => prevData.filter((seller) => seller.id !== id));

        const response = await deleteSeller(id);
        if (!response?.status) {
            setSellerData(previousData);
            showToast(false, response?.message ?? 'Failed to delete seller');
        } else {
            showToast(true, response?.message);
        }
    };

    // Handler for editing a seller
    const handleEdit = async (updatedItem: TListItem) => {
        const previousData = sellerData;
        if ('name' in updatedItem && 'password' in updatedItem) {
            const body = {
                userName: updatedItem.name,
                password: updatedItem.password,
                role: 'USER',
            };

            // Optimistically update the UI
            setSellerData((prevData) =>
                prevData.map((seller) => (seller.id === updatedItem.id ? updatedItem : seller)),
            );

            const response = await updateSeller(updatedItem.id, body);

            if (!response?.status) {
                setSellerData(previousData);
                showToast(false, response?.message ?? 'Failed to update seller');
            } else {
                showToast(true, response?.message);
            }
        }
    };

    return (
        <section className='space-y-5 sm:space-y-10'>
            <AddOptions fromFields={ADD_SELLER_FORM_FIELDS} onHandleSubmit={handleAdd} />
            <DataList
                heading='Sellers List'
                data={sellerData}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </section>
    );
};

export default AddSellerContainer;
