'use client';

import { format } from 'date-fns';
import React, { FC, useState } from 'react';
import { ExpensesResponse } from '@/types/expenses';
import AnimatedTabs from '@/components/ui/animatedTabs';
import { DatePicker } from '@/components/ui/datePicker';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrintOfItem, PrintOfSeller } from '.';
import { IItemIdAndName, IUserIdAndName } from '../page';

interface ISelectDate {
    from: Date | undefined;
    to: Date | undefined;
}

interface IProps {
    expenses: ExpensesResponse['data'];
    seller: IUserIdAndName[];
    items: IItemIdAndName[];
}

const PrintContainer: FC<IProps> = ({ items, seller, expenses }) => {
    const [activeTab, setActiveTab] = useState<string>('sell');
    const [selectedDate, setSelectedDate] = useState<ISelectDate>({
        from: undefined,
        to: new Date(),
    });
    const handleDate = (key: keyof ISelectDate, date: Date | undefined) => {
        if (date instanceof Date) {
            setSelectedDate({ ...selectedDate, [key]: date });
        }
    };
    // dates conversion
    const fromDate = format(selectedDate?.from ?? new Date(), 'dd-MM-yyyy');
    const toDate = format(selectedDate?.to ?? new Date(), 'dd-MM-yyyy');

    return (
        <section>
            <div className='flex items-center justify-between max-lg:flex-col gap-5 mb-5'>
                {/* from date | to date */}
                <div className='flex items-center flex-col xs:flex-row gap-3 lg:gap-6'>
                    <div className='flex items-center gap-3 max-xs:w-[250px]'>
                        <Label>From</Label>
                        <DatePicker
                            palceHolder='choose a date'
                            className='px-2 max-xs:w-44'
                            selectedDate={selectedDate?.from}
                            onSelectDate={(date: Date | undefined) => handleDate('from', date)}
                        />
                    </div>
                    <div className='flex items-center gap-3 max-xs:w-[250px]'>
                        <Label className='max-xs:w-[31px]'>To</Label>
                        <DatePicker
                            palceHolder='choose a date'
                            className='px-2 max-xs:w-44'
                            selectedDate={selectedDate?.to}
                            onSelectDate={(date: Date | undefined) => handleDate('to', date)}
                        />
                    </div>
                </div>
                {/* tabs */}
                <AnimatedTabs
                    containerClasses='gap-3'
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabsData={[
                        { id: 'buy', label: 'Buy' },
                        { id: 'sell', label: 'Sell' },
                    ]}
                />
            </div>
            <div className='grid max:xs:justify-center gap-3'>
                <h1 className='font-bold xs:text-xl'>Select Which One You Want to print</h1>
                <Tabs defaultValue='seller' className=''>
                    <TabsList>
                        <TabsTrigger value='seller'>Seller</TabsTrigger>
                        <TabsTrigger value='item'>Item</TabsTrigger>
                    </TabsList>
                    <TabsContent value='seller' className=''>
                        <PrintOfSeller
                            expenses={expenses}
                            seller={seller}
                            items={items}
                            fromDate={fromDate}
                            toDate={toDate}
                            activeTab={activeTab.toUpperCase()}
                        />
                    </TabsContent>
                    <TabsContent value='item'>
                        <PrintOfItem
                            expenses={expenses}
                            items={items}
                            activeTab={activeTab.toUpperCase()}
                            fromDate={fromDate}
                            toDate={toDate}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default PrintContainer;
