/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { Noop, RefCallBack, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z, ZodSchema, ZodType } from 'zod';
import { Item } from '@/types/items';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ComboSelectInput, SelectField } from '.';
import { Icons } from '../../core';
import { Input } from '../input';

export interface FormFieldConfig {
    name: string;
    fieldType?: 'input' | 'select' | 'textarea';
    type?: HTMLInputElement['type'];
    readOnly?: HTMLInputElement['readOnly'];
    value?: HTMLInputElement['value'];
    tabIndex?: HTMLInputElement['tabIndex'];
    disabled?: HTMLInputElement['disabled'];
    onSelectChange?: (value: string) => void;
    isComboSelect?: boolean;
    label?: string;
    placeholder?: string;
    description?: string;
    options?: string[] | Item[];
    validation: ZodType<any, any>;
    className?: string;
}
interface IClassNames {
    fromClassName?: string;
    buttonClassName?: string;
}
interface ReusableFormProps extends IClassNames {
    fields: FormFieldConfig[];
    onSubmit: (values: Record<string, unknown>) => void;
    buttonLabel?: string;
    isInlineButton?: boolean;
    resetOnSuccess?: boolean;
}
export type FormField = {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    value: any;
    disabled: boolean | undefined;
    name: string;
    ref: RefCallBack;
};
const CustomForm: FC<ReusableFormProps> = ({
    fields,
    onSubmit,
    buttonLabel = 'Submit',
    fromClassName,
    buttonClassName,
    isInlineButton,
    resetOnSuccess = true,
}) => {
    // from schema
    const formSchema = useMemo(() => {
        return z.object(
            fields.reduce(
                (schema, field) => {
                    schema[field.name] = field.validation;
                    return schema;
                },
                {} as Record<string, ZodSchema>,
            ),
        );
    }, [fields]);
    // from
    const defaultValues = useMemo(() => {
        return fields.reduce(
            (defaultValues, field) => {
                defaultValues[field.name] = field.value ?? '';
                return defaultValues;
            },
            {} as Record<any, any>,
        );
    }, [fields]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const handleSubmit: SubmitHandler<Record<string, unknown>> = useCallback(
        (values) => {
            onSubmit(values);
        },
        [onSubmit],
    );

    useEffect(() => {
        if (form.formState.isSubmitSuccessful && resetOnSuccess) {
            form.reset();
            toast.success('Form submitted successfully', {
                richColors: true,
                duration: 1000,
            });
        }
    }, [form.formState.isSubmitSuccessful, form, resetOnSuccess]);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className={cn('flex flex-col gap-4 mb-8', fromClassName)}>
                    {fields.map(
                        ({
                            name,
                            fieldType = 'input',
                            label,
                            placeholder,
                            description,
                            disabled,
                            onSelectChange,
                            options,
                            className,
                            isComboSelect = true,
                            ...rest
                        }) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={name}
                                render={({ field: formField }) => (
                                    <FormItem>
                                        {label && <FormLabel>{label}</FormLabel>}
                                        <FormControl>
                                            <div className='flex items-center gap-5 *:w-full'>
                                                {fieldType === 'input' && (
                                                    <Input
                                                        {...rest}
                                                        placeholder={placeholder}
                                                        className={cn(
                                                            'border-gray-100 dark:border-border',
                                                            className,
                                                        )}
                                                        onChange={(e) => {
                                                            const value =
                                                                rest.type === 'number'
                                                                    ? e.target.valueAsNumber
                                                                    : e.target.value;
                                                            formField.onChange(value);
                                                        }}
                                                        value={formField.value}
                                                    />
                                                )}
                                                {fieldType === 'textarea' && (
                                                    <Textarea
                                                        {...rest}
                                                        placeholder={placeholder}
                                                        className={cn(
                                                            'h-32 resize-none border-gray-100 dark:border-border',
                                                            className,
                                                        )}
                                                        {...formField}
                                                    />
                                                )}
                                                {fieldType === 'select' && (
                                                    <SelectFields
                                                        formField={formField}
                                                        options={options ?? []}
                                                        placeholder={placeholder}
                                                        onSelectChange={onSelectChange}
                                                        isComboSelect={isComboSelect}
                                                        disabled={disabled}
                                                        className={className}
                                                    />
                                                )}
                                            </div>
                                        </FormControl>
                                        {description && (
                                            <FormDescription>{description}</FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ),
                    )}
                    {isInlineButton && (
                        <SubmitButton
                            isSubmitting={form.formState.isSubmitting}
                            buttonLabel={buttonLabel}
                            className={buttonClassName}
                        />
                    )}
                </div>
                {!isInlineButton && (
                    <SubmitButton
                        isSubmitting={form.formState.isSubmitting}
                        buttonLabel={buttonLabel}
                        className={buttonClassName}
                    />
                )}
            </form>
        </Form>
    );
};

export default CustomForm;
// SubmitButton: Renders the submit button with loading state
const SubmitButton: FC<{ isSubmitting: boolean; buttonLabel: string; className?: string }> = ({
    isSubmitting,
    buttonLabel,
    className,
}) => (
    <Button type='submit' className={cn('w-full', className)} disabled={isSubmitting}>
        {isSubmitting ? (
            <>
                <Icons.Loader className='mr-1 size-4 animate-spin' /> {`${buttonLabel}ing...`}
            </>
        ) : (
            buttonLabel
        )}
    </Button>
);
//
const SelectFields = ({
    formField,
    options,
    placeholder,
    onSelectChange,
    isComboSelect,
    className,
    disabled,
}: {
    formField: any;
    options: string[] | Item[];
    placeholder?: string;
    onSelectChange?: (value: string) => void;
    isComboSelect?: boolean;
    className?: string;
    disabled?: boolean;
}) => {
    return (
        <>
            {isComboSelect ? (
                <ComboSelectInput
                    formField={formField}
                    options={options}
                    onSelectChange={onSelectChange}
                    placeholder={placeholder}
                    className={className}
                    disabled={disabled}
                />
            ) : (
                <SelectField formField={formField} options={options} />
            )}
        </>
    );
};
