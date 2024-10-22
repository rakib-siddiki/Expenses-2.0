'use client';

import React from 'react';
import { Item } from '@/types/items';
import { cn } from '@/lib/utils';
import { SelelectAndSearch } from '../selectAndSerch';
import { FormField } from './CustomForm';

interface IProps {
    formField: FormField;
    options: string[] | Item[];
    placeholder?: string;
    onSelectChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
}
const ComboSelectInput: React.FC<IProps> = ({
    formField,
    options,
    placeholder,
    onSelectChange,
    className,
    disabled,
}) => {
    return (
        <SelelectAndSearch
            options={(options as Item[]) ?? []}
            placeholder={placeholder ?? 'Select an option'}
            setValue={(e) => {
                formField.onChange(e);
                onSelectChange?.(e);
            }}
            value={formField.value as string}
            variant='outline'
            className={cn('px-2 w-full', className)}
            disabled={disabled}
        />
    );
};

export default ComboSelectInput;
