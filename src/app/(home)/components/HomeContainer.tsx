'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { TExpenses, TExpensesResponeData } from '@/types/expenses';
import { ItemsResponse } from '@/types/items';
import { OriginsResponse } from '@/types/origins';
import { TSeller } from '@/types/seller';
import AnimatedTabs from '@/components/ui/animatedTabs';
import { DatePicker } from '@/components/ui/datePicker';
import { fetchExpensesForDate } from '@/app/actions/expenses';
import { TAccountResponse } from '@/app/api/accounts/types';
import { AddExpenses, ExpensesTable } from '.';
import { useFilteredExpenses } from '../hooks';
import { buy, sell } from '../static';
import { transfromExpensesData } from '../utils';

interface IProps {
    items: ItemsResponse['data'] | undefined;
    origins: OriginsResponse['data'] | undefined;
    accounts: TAccountResponse[];
    user: TSeller | null;
}
export const expensesQueryKey = 'expenses';

const HomeContainer: FC<IProps> = ({ items, origins, accounts, user }) => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const searchParams = useSearchParams();
    const [selectedDate, setSelectedDate] = useState(() => {
        const dateParam = searchParams.get('date');
        return dateParam ? new Date(dateParam) : new Date();
    });

    const router = useRouter();

    const { data: res, isLoading } = useQuery({
        queryKey: [expensesQueryKey, selectedDate],
        queryFn: () => fetchExpensesForDate(selectedDate),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        select: (result) => ({
            success: result.success,
            message: undefined,
            data: transfromExpensesData({
                expenses: result?.data ?? [],
                items,
                origins,
                user,
            }) as unknown as TExpensesResponeData[],
        }),
    });

    const expensesData = useMemo(() => (res?.data as unknown as TExpenses[]) ?? [], [res?.data]);
    const filteredData = useFilteredExpenses(expensesData, selectedDate, activeTab);

    const handleDateChange = useCallback(
        (date: Date | undefined) => {
            if (date) {
                setSelectedDate(date);
                const dateString = date.toLocaleDateString('en-CA');
                router.push(`?date=${dateString}`, { scroll: false });
            }
        },
        [router],
    );

    return (
        <section className='container'>
            <div className='flex justify-between flex-wrap md:items-center max-xs:flex-col gap-4 my-6'>
                <AnimatedTabs
                    containerClasses='gap-3 max-md:justify-center'
                    className='w-20'
                    tabsData={[
                        { id: 'all', label: 'All' },
                        { id: sell, label: 'Sell' },
                        { id: buy, label: 'Buy' },
                    ]}
                    setActiveTab={(current) => setActiveTab(current)}
                    activeTab={activeTab}
                />

                <div className='flex items-center gap-4 justify-center'>
                    <AddExpenses
                        activeTab={activeTab}
                        items={items}
                        origins={origins}
                        accounts={accounts}
                        user={user}
                    />
                    <DatePicker onSelectDate={handleDateChange} selectedDate={selectedDate} />
                </div>
            </div>

            <ExpensesTable
                data={filteredData ?? []}
                activeTab={activeTab}
                currentUserId={user?.id ?? ''}
                currentUserRole={user?.role ?? 'USER'}
                items={items}
                origins={origins}
                accounts={accounts}
                isLoading={isLoading}
            />
        </section>
    );
};

export default HomeContainer;
