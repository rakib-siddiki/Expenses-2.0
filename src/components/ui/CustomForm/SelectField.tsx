import { Item } from '@prisma/client';
import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../select';
import { FormField } from './CustomForm';

const SelectField = ({
    formField,
    options,
}: {
    formField: FormField;
    options: string[] | Item[];
}) => {
    return (
        <Select {...formField} onValueChange={formField.onChange}>
            <SelectTrigger className='border-gray-100 dark:border-border'>
                <SelectValue placeholder={'Select an option'} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options?.map((option) =>
                        typeof option !== 'string' ? (
                            <SelectItem key={option.id} value={option.name} className='capitalize'>
                                {option.name}
                            </SelectItem>
                        ) : (
                            <SelectItem key={option} value={option} className='capitalize'>
                                {option}
                            </SelectItem>
                        ),
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default SelectField;
