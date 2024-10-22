import { Metadata } from 'next';
import React from 'react';
import { getItemsAction } from '@/app/actions/Items';
import { getOriginsAction } from '@/app/actions/origin';
import { AddOriginContianer } from './components';

export const metadata: Metadata = {
    title: 'Add Origin',
};

const AddItemPage = async () => {
    const { data } = await getOriginsAction();
    const { data: items } = await getItemsAction();
    return <AddOriginContianer data={data} items={items} />;
};

export default AddItemPage;
