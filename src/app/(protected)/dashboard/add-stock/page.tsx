import { Metadata } from 'next';
import React from 'react';
import { getItemsAction } from '@/app/actions/Items';
import { getOriginsAction } from '@/app/actions/origin';
import { getStocksWithAvgRateAction } from '@/app/actions/stocks';
import { AddStockContianer } from './components';

export const metadata: Metadata = {
    title: 'Add Stock',
};

const AddItemPage = async () => {
    const { data: items } = await getItemsAction();
    const { data: origins } = await getOriginsAction();
    const { data: stockWithAvg } = await getStocksWithAvgRateAction();
    const originOptions = origins?.map(({ id, name }) => ({
        id,
        name,
    }));
    return (
        // @ts-expect-error TODO: fix types
        <AddStockContianer originOptions={originOptions} itemOptions={items} data={stockWithAvg} />
    );
};

export default AddItemPage;
