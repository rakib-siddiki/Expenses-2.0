import { Prisma } from '@prisma/client'; // Import Prisma for Decimal handling
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TExpenses } from '@/types/expenses';
import { buy, sell } from '@/app/(home)/static';


export * from './timeZone';
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export function formatDate(date: Date) {
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    } as const;

    return new Intl.DateTimeFormat('en-US', options).format(date);
}


const filterAndSum = (data: TExpenses[], type: string, key: keyof TExpenses) => {
    return data
        .filter((i) => i.type === type)
        .reduce((acc, item) => {
            const value = item[key];

            // Check if the value is a valid number, Prisma.Decimal, or string that can be converted to Decimal
            if (value instanceof Prisma.Decimal) {
                return acc.add(value); // Use Prisma.Decimal's add method
            } else if (typeof value === 'number') {
                return acc.add(new Prisma.Decimal(value)); // Convert number to Prisma.Decimal
            } else if (typeof value === 'string' && !isNaN(Number(value))) {
                // Convert string to Decimal if it represents a valid number
                return acc.add(new Prisma.Decimal(value));
            } else if (value === null || value === undefined) {
                // Handle cases where value is null or undefined
                console.log(`Warning: Value at key ${key} is null or undefined`);
                return acc; // Skip adding and return the accumulator as is
            } else {
                throw new Error(`Value at key ${key} is not a valid number or Decimal`);
            }
        }, new Prisma.Decimal(0)) // Initialize accumulator as a Prisma.Decimal
        .toNumber(); // Convert the result back to a number (or use .toString() if needed)
};


export function calcutalateExpenses(data: TExpenses[]) {
    const totalSell = filterAndSum(data, sell, 'amount');
    const totalBuy = filterAndSum(data, buy, 'amount');
    const totalSellQuantity = filterAndSum(data, sell, 'quantity');
    const totalBuyQuantity = filterAndSum(data, buy, 'quantity');

    const totalAmount = totalSell - totalBuy;
    return {
        totalSell: totalSell.toLocaleString(),
        totalBuy: totalBuy.toLocaleString(),
        totalSellQuantity: totalSellQuantity.toLocaleString(),
        totalBuyQuantity: totalBuyQuantity.toLocaleString(),
        totalAmount: totalAmount.toLocaleString(),
    };
}