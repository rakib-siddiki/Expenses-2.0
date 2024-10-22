import React from 'react';
import { getAccounts } from '@/app/actions/accounts';
import { TAccountResponse } from '@/app/api/accounts/types';
import { AddAccountsContianer } from './components';

const AddAccountsPage = async () => {
    const response = await getAccounts();
    if (response) {
        if ('success' in response && !response.success) {
            console.log('🚀 > file: page.tsx:8 > AddAccountsPage > response:', response.message);
            return null;
        }
    }
    return <AddAccountsContianer data={(response as TAccountResponse[]) ?? []} />;
};

export default AddAccountsPage;
