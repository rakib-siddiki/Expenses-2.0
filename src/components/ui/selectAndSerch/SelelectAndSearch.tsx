'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import React, { FC, useState } from 'react';
import { Item } from '@/types/items';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface IComboboxProps {
    options: Item[] | string[];
    value: string;
    placeholder: string;
    setValue: (seller: string) => void;
    disabled?: boolean;
}
type TProps = ButtonProps & IComboboxProps;
const SelelectAndSearch: FC<TProps> = ({
    options,
    value,
    setValue,
    placeholder,
    disabled,
    ...rest
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (currentValue: string) => {
        setValue(value === currentValue ? '' : currentValue);
        setOpen(false);
    };
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={rest?.variant ?? 'ghost'}
                    role='combobox'
                    aria-expanded={open}
                    className={cn('justify-between px-1 capitalize', rest?.className)}
                    disabled={disabled}
                >
                    {value || placeholder}
                    <ChevronsUpDown className=' ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command>
                    <CommandInput placeholder='Search here' />
                    <CommandList>
                        <CommandEmpty>No result found.</CommandEmpty>
                        <CommandGroup>
                            {/* "All" option */}
                            <CommandItem key='all' value='' onSelect={() => handleSelect('')}>
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        value === '' ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                                All
                            </CommandItem>
                            {options.map((option) =>
                                typeof option === 'string' ? (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        onSelect={() => handleSelect(option)}
                                        className='capitalize'
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4 capitalize',
                                                value === option ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                        {option}
                                    </CommandItem>
                                ) : (
                                    <CommandItem
                                        key={option.id}
                                        value={option.name}
                                        onSelect={() => handleSelect(option.name)}
                                        className='capitalize'
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === option.name ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                        <span className='flex justify-between gap-1 w-full'>
                                            {option.name}
                                            {option?.balance === 0 || option?.balance ? (
                                                <p className='text-gray-200'>
                                                    {option?.balance.toLocaleString()} ৳
                                                </p>
                                            ) : null}
                                        </span>
                                    </CommandItem>
                                ),
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
export default SelelectAndSearch;
