import { Metadata } from 'next';
import React from 'react';
import { getItemsAction } from '@/app/actions/Items';
import { AddItemsContianer } from './components';

export const metadata: Metadata = {
    title: 'Add Item',
};

const AddItemPage = async () => {
    const { data } = await getItemsAction();
    return <AddItemsContianer data={data ?? []} />;
};

export default AddItemPage;
