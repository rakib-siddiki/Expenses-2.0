'use client';

import { useRouter } from 'next/navigation';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import useShowToast from '@/hooks/useShowToast';
import { Button, ButtonProps } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isUser } from '@/app/actions/isUser';
import { onLogout } from '@/app/actions/logout';
import { updateSeller } from '@/app/actions/user';

interface IAdmin {
    id?: string;
    name: string;
    password: string;
}

interface IProps extends ButtonProps {}

const ProfileSettings: FC<IProps> = ({ className, ...rest }) => {
    const [admin, setAdmin] = useState<IAdmin>({ id: '', name: '', password: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editValues, setEditValues] = useState<IAdmin>({ name: '', password: '' });

    const { showToast } = useShowToast();
    const router = useRouter();
    const handleSave = useCallback(async () => {
        if (admin.name !== editValues.name || admin.password !== editValues.password) {
            const data = await updateSeller(admin.id ?? '', {
                userName: editValues.name,
                password: editValues.password,
                role: 'ADMIN',
            });
            if (!data?.status) {
                showToast(false, 'Failed to update Admin profile. Please try again later.');
                setIsDialogOpen(false);
                return;
            }
            await onLogout();
            showToast(true, 'Admin profile updated successfully.');
            setIsDialogOpen(false);
            router.push('/login');
        }
    }, [
        admin.id,
        admin.name,
        admin.password,
        editValues.name,
        editValues.password,
        router,
        showToast,
    ]);

    const handleChange = useCallback((key: keyof IAdmin, value: string) => {
        setEditValues((prev) => ({ ...prev, [key]: value }));
    }, []);

    useEffect(() => {
        const getAdmin = async () => {
            try {
                const user = await isUser();
                if (user) {
                    setAdmin({
                        id: user.id,
                        name: user.userName ?? '',
                        password: user.password ?? '',
                    });
                    setEditValues({
                        name: user.userName ?? '',
                        password: user.password ?? '',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };
        void getAdmin();
    }, []);

    return (
        <>
            <Button
                {...rest}
                variant='outline'
                className={cn('absolute bottom-[85px] left-1/2 -translate-x-1/2 w-10/12 dark:hover:bg-gray-800', {
                    className,
                })}
                onClick={() => setIsDialogOpen(true)}
            >
                Profile Settings
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogDescription className='sr-only'>Edit profile</DialogDescription>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <Label>User Name</Label>
                    <Input
                        type='text'
                        value={editValues.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className='mb-4'
                        placeholder='Edit username'
                    />
                    <Label>Password</Label>
                    <Input
                        type='text'
                        value={editValues.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className='mb-4'
                        placeholder='Edit password'
                    />
                    <div className='flex justify-end gap-2'>
                        <button
                            className='px-4 py-2 bg-gray-200 text-gray-700 rounded'
                            onClick={() => setIsDialogOpen(false)}
                            aria-label='Cancel editing profile'
                        >
                            Cancel
                        </button>
                        <button
                            className='px-4 py-2 bg-blue-500 text-white rounded'
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={handleSave}
                            aria-label='Save profile changes'
                        >
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default React.memo(ProfileSettings);
