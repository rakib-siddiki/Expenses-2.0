import { getUser } from '@/http/user';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { Sidebar } from './components';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const userId = cookies().get('userId')?.value;
    const user = await getUser(userId as string);
    const isAdmin = user?.data && 'role' in user.data && user.data.role === 'ADMIN';
    if (!isAdmin) return redirect('/');
    return (
        <main className='flex flex-grow'>
            <section className='max-md:hidden'>
                <Sidebar />
            </section>
            <section className='py-5 container'>{children}</section>
        </main>
    );
};

export default AdminLayout;
