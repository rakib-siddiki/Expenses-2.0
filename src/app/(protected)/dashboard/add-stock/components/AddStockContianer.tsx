/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import React, { FC, useState } from 'react';
import { z } from 'zod';
import { Item } from '@/types/items';
import { StockResponse } from '@/types/stocks';
import useShowToast from '@/hooks/useShowToast';
import { FormFieldConfig } from '@/components/ui/CustomForm/CustomForm';
import { addStockAction, editStockAction } from '@/app/actions/stocks';
import { AddOptions, DataList } from '../../components';
import { TListItem } from '../../components/DataList/DataList';

interface IProps {
    data: StockResponse['data'] | undefined;
    itemOptions: Item[] | undefined;
    originOptions: { id: string; name: string }[] | undefined;
}
const AddOriginContianer: FC<IProps> = ({ data, itemOptions, originOptions }) => {
    const initialStocks = data?.map(({ id, quantity, origin, avgBuyRate }) => ({
        id,
        item: origin.item.name,
        origin: origin.name,
        stock: quantity,
        avgBuyRate: parseFloat(String(avgBuyRate)),
    }));

    const [stock, setStock] = useState(initialStocks);
    const { showToast } = useShowToast();
    const ADD_STOCK_FORM_FIELDS: FormFieldConfig[] = [
        {
            name: 'item',
            fieldType: 'select',
            options: itemOptions,
            validation: z.string().min(1, { message: 'Please select an item.' }),
            placeholder: 'Item',
        },
        {
            name: 'origin',
            fieldType: 'select',
            options: originOptions,
            validation: z.string().min(1, { message: 'Please select the origin.' }),
            placeholder: 'Origin',
        },
        {
            name: 'stock',
            fieldType: 'input',
            validation: z
                .number()
                .nonnegative()
                .min(0, { message: 'Stock must be a non-negative number.' }),
            placeholder: 'Enter the stock',
            type: 'number',
        },
    ];

    const handleAdd = async (val: Record<string, unknown>) => {
        const prevState = stock ? [...stock] : [];
        const newId = (
            Math.max(...prevState.map((seller) => parseInt(seller.id) || 0)) + 1
        ).toString();
        const data = {
            id: newId,
            item: val.item as string,
            origin: val.origin as string,
            stock: val.stock as number,
            avgBuyRate: stock?.find((i) => i.id === newId)?.avgBuyRate ?? 0,
        };
        setStock((prev = []) => [...prev, data]);

        const originId = originOptions?.find((i) => i.name === val.origin)?.id;
        const payload = {
            originId: originId as string,
            quantity: val.stock as number,
        };

        const res = await addStockAction(payload);
        if (!res.success) {
            setStock(prevState);
            showToast(false, res?.message ?? 'An error occurred');
        } else {
            showToast(true, 'Stock added successfully');
        }
    };

    const handleEdit = async (updatedStock: TListItem) => {
        if ('item' in updatedStock && 'origin' in updatedStock && 'stock' in updatedStock) {
            const prevState = stock ? [...stock] : [];

            const originId = originOptions?.find((i) => i.name === updatedStock.origin)?.id ?? '';
            const payload = {
                originId,
                quantity: Number(updatedStock.stock),
            };
            const res = await editStockAction(updatedStock.id, payload);

            if (!res.success) {
                setStock(prevState);
                showToast(false, res?.message ?? 'An error occurred');
            } else {
                showToast(true, 'Stock updated successfully');
            }
            setStock((prev = []) => {
                // Create a Set to ensure uniqueness based on the stringified stock objects
                const uniqueOrigins = new Set(prev.map((stock) => JSON.stringify(stock)));
                const updatedStockString = JSON.stringify(updatedStock);

                // Check if the updated stock is unique before making changes
                if (!uniqueOrigins.has(updatedStockString)) {
                    return prev.map((item) =>
                        item.id === updatedStock.id
                            ? {
                                  ...updatedStock,
                                  stock: updatedStock.stock as number,
                                  avgBuyRate: item.avgBuyRate,
                              }
                            : item,
                    );
                }
                return prev;
            });
        }
    };

    return (
        <section className='space-y-5 sm:space-y-10'>
            <AddOptions fromFields={ADD_STOCK_FORM_FIELDS} onHandleSubmit={handleAdd} />
            <DataList
                CardContainerClass='xs:grid grid-cols-5'
                heading='Stock List'
                isStockPage
                data={stock ?? []}
                onEdit={handleEdit}
                itemOptions={itemOptions}
                originOptions={originOptions}
            />
        </section>
    );
};

export default AddOriginContianer;
