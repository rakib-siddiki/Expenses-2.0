import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';
import { isLoggedInAction } from '../actions/isLoggedIn';
import { LoginContainer } from './components';

export const metadata: Metadata = {
    title: 'Login',
};
const LoginPage = async () => {
    const { isLoggedIn } = await isLoggedInAction();
    if (isLoggedIn) return redirect('/');
    return <LoginContainer />;
};

export default LoginPage;
