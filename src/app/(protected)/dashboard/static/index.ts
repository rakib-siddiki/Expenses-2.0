import { z } from 'zod';
import { FormFieldConfig } from '@/components/ui/CustomForm/CustomForm';

export const ADD_SELLER_FORM_FIELDS: FormFieldConfig[] = [
    {
        name: 'name',
        fieldType: 'input',
        validation: z.string().min(1, { message: 'Please enter the seller name.' }),
        placeholder: 'Enter your user name',
        type: 'text',
        className: 'rounded-sm',
    },
    {
        name: 'password',
        fieldType: 'input',
        validation: z.string().min(1, { message: 'Please enter the password.' }),
        placeholder: 'Enter your password',
        type: 'text',
        className: 'rounded-sm',
    },
];
export const ADD_ITEM_FORM_FIELDS: FormFieldConfig[] = [
    {
        name: 'name',
        fieldType: 'input',
        validation: z.string().min(1, { message: 'Please enter the item name.' }),
        placeholder: 'Enter your item name',
        type: 'text',
        className: 'rounded-sm',
    },
];
