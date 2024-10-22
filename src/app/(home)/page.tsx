import { Metadata } from 'next';
import { getAccounts } from '../actions/accounts';
import { isLoggedInAction } from '../actions/isLoggedIn';
import { isUser } from '../actions/isUser';
import { getItemsAction } from '../actions/Items';
import { getOriginsAction } from '../actions/origin';
import { TAccountResponse } from '../api/accounts/types';
import { HomeContainer } from './components';

export const metadata: Metadata = {
    title: 'Home',
};
const HomePage = async () => {
    await isLoggedInAction();
    const { data: items } = await getItemsAction();
    const { data: origins } = await getOriginsAction();
    const response = await getAccounts();
    if (response) {
        if ('success' in response && !response.success) {
            console.log('🚀 > file: page.tsx:8 > AddAccountsPage > response:', response.message);
            // return null;
        }
    }
    const currentUser = await isUser();
    return (
        <HomeContainer
            items={items}
            origins={origins}
            user={currentUser}
            accounts={response as TAccountResponse[]}
        />
    );
};

export default HomePage;
