import { getAllSeller } from '@/http/user';
import { Metadata } from 'next';
import React from 'react';
import AddSellerContainer from './AddSellerContainer';

export const metadata: Metadata = {
    title: 'Add Seller',
};
const AddSellerPage = async () => {
    const res = await getAllSeller();
    if (!res) {
        // Handle the case where res is null or undefined
        return <div>Error: Unable to fetch sellers</div>;
    }
    return <AddSellerContainer data={res.data} />;
};
export default AddSellerPage;
