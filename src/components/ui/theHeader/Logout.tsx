/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { useRouter } from 'next/navigation';
import { onLogout } from '@/app/actions/logout';
import { Button, ButtonProps } from '../button';

interface IProps extends ButtonProps {
    children?: React.ReactNode;
}
const LogoutButton = ({ className, children, ...rest }: IProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        // Call the server-side logout function
        const result = await onLogout();

        // If logout was successful, redirect to login
        if (result.success) {
            router.push('/login');
        } else {
            console.error('Logout failed:', result.message);
        }
    };

    return (
        <Button {...rest} className={className} onClick={handleLogout}>
            {children}
        </Button>
    );
};

export default LogoutButton;
