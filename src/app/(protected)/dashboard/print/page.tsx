import { Metadata } from 'next';
import React from 'react';
import { getExpensesAction } from '@/app/actions/expenses';
import { PrintContainer } from './components';

export const metadata: Metadata = {
    title: 'Print',
};
export interface IUserIdAndName {
    userId: string;
    userName: string;
}
export interface IItemIdAndName {
    itemId: string;
    name: string;
}
const PrintPage = async () => {
    const res = await getExpensesAction();
    if (!res.success || res.data?.length === 0) {
        return (
            <div className='text-red-500 grid place-items-center h-dvh text-xl md:text-2xl'>
                Error: Unable to fetch
            </div>
        );
    }
    const uniqueUsers = res.data
        ? Object.values(
              res.data.reduce(
                  (acc: { [key: string]: IUserIdAndName }, { userId, user: { userName } }) => {
                      acc[userId] = { userId, userName };
                      return acc;
                  },
                  {},
              ),
          )
        : [];
    const uniqueItem = res.data
        ? Object.values(
              res.data.reduce(
                  (acc: { [key: string]: IItemIdAndName }, { itemId, item: { name } }) => {
                      acc[itemId] = { itemId, name };
                      return acc;
                  },
                  {},
              ),
          )
        : [];

    return <PrintContainer seller={uniqueUsers} items={uniqueItem} expenses={res?.data} />;
};

export default PrintPage;
