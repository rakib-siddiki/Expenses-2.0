/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import React, { FC, useState } from 'react';
import { z } from 'zod';
import { Item } from '@/types/items';
import { OriginsResponse } from '@/types/origins';
import useShowToast from '@/hooks/useShowToast';
import { FormFieldConfig } from '@/components/ui/CustomForm/CustomForm';
import { addOriginAction, deleteOriginAction, editOriginAction } from '@/app/actions/origin';
import { AddOptions, DataList } from '../../components';
import { TListItem } from '../../components/DataList/DataList';

interface IProps {
    data: OriginsResponse['data'] | undefined;
    items: Item[] | undefined;
}

const AddOriginContianer: FC<IProps> = ({ data, items }) => {
    const initialOrigin = data?.map(({ id, itemId, name }) => ({
        id,
        item: itemId,
        origin: name,
    }));

    const [origins, setOrigins] = useState(initialOrigin || []);
    const { showToast } = useShowToast();

    const ADD_ORIGIN_FORM_FIELDS: FormFieldConfig[] = [
        {
            name: 'item',
            fieldType: 'select',
            options: items,
            validation: z.string().min(1, { message: 'Please select an item.' }),
            placeholder: 'Select an item',
        },
        {
            name: 'origin',
            fieldType: 'input',
            validation: z.string().min(1, { message: 'Please enter the orgin name.' }),
            placeholder: 'Enter the orgin name',
            type: 'text',
        },
    ];

    const handleAdd = async (val: Record<string, unknown>) => {
        const selectedItem = items?.find((i) => i.name === val.item);
        // Step 1: Store previous state before updating

        const previousOrigins = [...origins]; // Copy the previous state

        // Step 2: Update the state optimistically
        const newId = (Math.max(...origins.map((origin) => parseInt(origin.id))) + 1).toString();
        const newOrigin = {
            id: newId,
            item: selectedItem?.id as string,
            origin: val.origin as string,
        };
        setOrigins((prev) => [...prev, newOrigin]);

        // Step 3: Make the async request and handle response
        const res = await addOriginAction(val.origin as string, selectedItem?.id as string);
        if (!res.success) {
            // Step 4: Revert the state if request fails
            setOrigins(previousOrigins); // Revert to previous state

            showToast(false, res?.message ?? 'An error occurred'); // Show error message
        } else {
            showToast(true, 'Origin added successfully'); // Show success message
        }
    };

    const handleDelete = async (id: string) => {
        setOrigins((prev) => prev.filter((seller) => seller.id !== id));
        const res = await deleteOriginAction(id);

        if (!res.success) {
            showToast(false, res.message ?? 'An error occurred');
        } else {
            showToast(true, 'Origin deleted successfully');
        }
    };

    const handleEdit = async (updatedOrigin: TListItem) => {
        if ('item' in updatedOrigin && 'origin' in updatedOrigin) {
            // now TypeScript knows that updatedItem has a name property
            setOrigins((prev) => {
                const uniqueOrigins = new Set(prev.map((origin) => JSON.stringify(origin)));
                const updatedOriginString = JSON.stringify(updatedOrigin);
                if (!uniqueOrigins.has(updatedOriginString)) {
                    return prev.map((item) =>
                        item.id === updatedOrigin.id ? updatedOrigin : item,
                    );
                }
                return prev;
            });

            const res = await editOriginAction(
                updatedOrigin.id,
                updatedOrigin.origin,
                items?.find((i) => i.name === updatedOrigin.item)?.id as string,
            );

            if (!res.success) {
                return showToast(false, res.message ?? 'An error occurred');
            } else {
                showToast(true, 'Origin updated successfully');
            }
        }
    };

    return (
        <section className='space-y-5 sm:space-y-10'>
            <AddOptions fromFields={ADD_ORIGIN_FORM_FIELDS} onHandleSubmit={handleAdd} />
            <DataList
                CardContainerClass='grid grid-cols-3'
                heading='List of origins'
                data={origins}
                onDelete={handleDelete}
                onEdit={handleEdit}
                itemOptions={items}
            />
        </section>
    );
};

export default AddOriginContianer;
