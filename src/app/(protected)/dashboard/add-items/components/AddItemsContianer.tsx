/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import React, { useState } from 'react';
import useShowToast from '@/hooks/useShowToast';
import { addItemAction, deleteItemAction, editItemAction } from '@/app/actions/Items';
import { AddOptions, DataList } from '../../components';
import { TListItem } from '../../components/DataList/DataList';
import { ADD_ITEM_FORM_FIELDS } from '../../static';

export type TItem = {
    id: string;
    name: string;
};
const AddItemsContianer: React.FC<{ data: TItem[] }> = ({ data }) => {
    const [items, setItems] = useState<TItem[]>(data);
    const { showToast } = useShowToast();
    const handleAdd = async (val: Record<string, unknown>) => {
        const prevState = items ? [...items] : [];
        const newId = (Math.max(...prevState.map((seller) => parseInt(seller.id))) + 1).toString();
        const data = {
            id: newId,
            name: val.name as string,
        };
        setItems((prev) => [...prev, data]);
        const res = await addItemAction(val.name as string);
        if (!res?.success) {
            setItems(prevState);
            showToast(false, res?.message ?? '');
            return;
        }
        showToast(true, 'Item added successfully');
    };
    const handleDelete = async (id: string) => {
        setItems((prev) => prev.filter((seller) => seller.id !== id));
        const res = await deleteItemAction(id);
        if (!res?.success) {
            showToast(false, res.message);
            return;
        }
        showToast(true, res.message);
    };
    const handleEdit = async (updatedItem: TListItem) => {
        if ('name' in updatedItem && updatedItem.name) {
            // now TypeScript knows that updatedItem has a name property
            setItems((prev) =>
                prev.map((item) =>
                    item.id === updatedItem.id
                        ? {
                              ...item,
                              name: updatedItem.name ?? '',
                          }
                        : item,
                ),
            );
            const res = await editItemAction(updatedItem.id, updatedItem.name);
            if (!res?.success) {
                showToast(false, res?.message ?? '');
                return;
            }
            showToast(true, 'Item updated successfully');
        }
    };
    return (
        <section className='space-y-5 sm:space-y-10'>
            <AddOptions fromFields={ADD_ITEM_FORM_FIELDS} onHandleSubmit={handleAdd} />

            <DataList
                heading='Items List'
                data={items ?? []}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </section>
    );
};

export default AddItemsContianer;
