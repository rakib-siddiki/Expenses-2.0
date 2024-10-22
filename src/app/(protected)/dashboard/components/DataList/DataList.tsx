/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { FC } from 'react';
import { Item } from '@/types/items';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import {
    DeleteData,
    EditAccountsData,
    EditItemsData,
    EditOriginOrStockData,
    EditSellerData,
} from '.';
import { TItem } from '../../add-items/components/AddItemsContianer';
import { TAccountResponse } from '@/app/api/accounts/types';

export type TListItem =
    | TAccountResponse
    | {
          id: string;
          item: string;
          origin: string;
          name?: string;
          stock?: number;
          avgBuyRate?: number;
      }
    | {
          id: string;
          name: string;
          password: string;
      }
    | TItem;

interface IProps {
    data: TListItem[];
    heading: string;
    onDelete?: (id: string) => void;
    onEdit: (payload: TListItem) =>  Promise<void>;
    itemOptions?: Item[];
    originOptions?: Item[];
    CardContainerClass?: string;
    isStockPage?: boolean;
}

// Type guard to check if the item is the type with 'item' and 'origin'
const isItemWithOrigin = (
    itemList: TListItem,
): itemList is { id: string; item: string; origin: string } => {
    return (itemList as { item: string; origin: string }).item !== undefined;
};

// Type guard to check if the item is the type with 'password'
const isItemWithPassword = (
    itemList: TListItem,
): itemList is { id: string; name: string; password: string } => {
    return (itemList as { password: string }).password !== undefined;
};

const DataList: FC<IProps> = ({
    data,
    heading,
    onDelete,
    onEdit,
    itemOptions,
    originOptions,
    CardContainerClass,
    isStockPage,
}) => {
    return (
        <div className='grid place-items-center max-h-[600px] overflow-y-auto'>
            <h1 className='text-xl font-bold mb-5'>{heading}</h1>
            {data.length === 0 ? (
                <h1>No data to show</h1>
            ) : (
                <ul
                    className={cn('w-full max-w-lg', {
                        'max-w-xl': isStockPage,
                    })}
                >
                    {(data ?? []).map((item) => {
                        // if the item is an account
                        if ('accountName' in item) {
                            return (
                                <li key={item.id} className='mb-4 last:mb-0'>
                                    <Card className='rounded-md'>
                                        <CardContent
                                            className={cn(
                                                'px-4 py-2 flex items-center justify-between gap-2 w-full max-w-full',
                                                CardContainerClass,
                                            )}
                                        >
                                            <p className='capitalize'>{item.accountName}</p>
                                            <p>{item.balance.toLocaleString()}</p>
                                            <div className='flex gap-3 items-center justify-end'>
                                                {onEdit && (
                                                    <EditAccountsData account={item} onEdit={onEdit} />
                                                )}
                                                {onDelete && (
                                                    <DeleteData onDelete={onDelete} id={item.id} />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </li>
                            );
                        }
                        // find the item name based on the item id or name
                        const itemName =
                            isItemWithOrigin(item) &&
                            itemOptions?.find((i) => i.id === item.item || i.name === item.item)
                                ?.name;

                        return (
                            <li key={item?.id} className='mb-4 last:mb-0'>
                                <Card className='rounded-md'>
                                    <CardContent
                                        className={cn(
                                            'px-4 py-2 flex items-center justify-between  gap-2 w-full max-w-full *:font-semibold',
                                            CardContainerClass,
                                        )}
                                    >
                                        {isItemWithOrigin(item) ? (
                                            <>
                                                <p className='capitalize'>{itemName}</p>
                                                <p className='capitalize'>{item.origin}</p>
                                                {isStockPage && item.stock && (
                                                    <p>{item.stock.toLocaleString()}</p>
                                                )}
                                                {isStockPage && (
                                                    <div className='flex items-center gap-1 text-sm'>
                                                        Avg buy:
                                                        <p>{item.avgBuyRate?.toFixed(2) ?? 0}</p>
                                                    </div>
                                                )}
                                                <div
                                                    className={cn(
                                                        'flex gap-2 items-center *:size-5',
                                                        {
                                                            'justify-end': item.stock,
                                                        },
                                                        {
                                                            'justify-end': item.origin,
                                                        },
                                                    )}
                                                >
                                                    <EditOriginOrStockData
                                                        data={item}
                                                        onEdit={onEdit}
                                                        itemOptions={itemOptions}
                                                        originOptions={originOptions ?? []}
                                                        isStockPage={isStockPage}
                                                    />
                                                    {onDelete && (
                                                        <DeleteData
                                                            onDelete={onDelete}
                                                            id={item?.id}
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : isItemWithPassword(item) ? (
                                            <>
                                                <div>
                                                    <p>Username: {item.name}</p>
                                                    <p>Password: {item.password}</p>
                                                </div>
                                                <div className='flex gap-2 items-center *:size-5'>
                                                    <EditSellerData user={item} onEdit={onEdit} />
                                                    {onDelete && (
                                                        <DeleteData
                                                            onDelete={onDelete}
                                                            id={item?.id}
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <p className='capitalize'>{item.name}</p>
                                                </div>
                                                <div className='flex gap-2 items-center *:size-5'>
                                                    <EditItemsData item={item} onEdit={onEdit} />
                                                    {onDelete && (
                                                        <DeleteData
                                                            message='This action cannot be undone. This will permanently delete your item and remove your data from our servers.'
                                                            onDelete={onDelete}
                                                            id={item?.id}
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default DataList;
