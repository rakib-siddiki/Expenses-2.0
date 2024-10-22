/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { useRouter } from 'next/navigation';
import React, { memo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CustomForm, { FormFieldConfig } from '@/components/ui/CustomForm/CustomForm';
import RotatingDotsLoader from '@/components/ui/rotating-dots-loader';
import { ILogin, onLogin } from '@/app/actions/login';

const fromFields: FormFieldConfig[] = [
    {
        name: 'userName',
        type: 'text',
        validation: z
            .string()
            .min(1, { message: 'Please enter your username' })
            .max(255, { message: 'Username should be less than 255 characters' }),
        placeholder: 'Username',
    },
    {
        name: 'password',
        type: 'password',
        validation: z
            .string()
            .min(1, { message: 'Please enter your password' })
            .max(255, { message: 'Password should be less than 255 characters' }),
        placeholder: 'Password',
    },
];
const LoginContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleLogin = async (val: Record<string, unknown>) => {
        const body: ILogin = {
            email: val.userName as string,
            userName: val.userName as string,
            password: val.password as string,
        };
        const data = await onLogin(body);
        if (!data?.success) {
            toast.error(data?.message);
            return;
        }
        if (data?.success) {
            toast.success(data.message);
            router.push('/');
            setIsLoading(true);
        }
    };
    return (
        <section className='container'>
            <div className='grid place-items-center heightWithoutNavbar'>
                {isLoading ? (
                    <RotatingDotsLoader />
                ) : (
                    <Card className='w-full max-w-96'>
                        <CardHeader>
                            <h1 className='text-lg md:text-xl font-bold'>
                                Login into your account
                            </h1>
                        </CardHeader>
                        <CardContent>
                            <CustomForm
                                resetOnSuccess={false}
                                onSubmit={handleLogin}
                                fields={fromFields}
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
};

export default memo(LoginContainer);
