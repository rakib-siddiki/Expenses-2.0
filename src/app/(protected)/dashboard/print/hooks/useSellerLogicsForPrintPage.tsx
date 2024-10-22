import { isWithinInterval, parse, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { ExpensesResponse } from '@/types/expenses';
import { IItemIdAndName, IUserIdAndName } from '../page';

interface IItemPrintOut {
    item: string;
    origin?: string; // For when both seller and item are selected
    quantity: number;
    totalTK: number;
    originCount?: number;
}
interface IProps {
    fromDate: string;
    toDate: string;
    sellectedSeller: string;
    selectedItem: string;
    seller: IUserIdAndName[];
    items: IItemIdAndName[];
    expenses: ExpensesResponse['data'];
    activeTab: string;
}
const useSellerLogicsForPrintPage = ({
    fromDate,
    toDate,
    sellectedSeller,
    selectedItem,
    activeTab,
    seller,
    items,
    expenses,
}: IProps) => {
    const sellerOptions = seller?.map(({ userName }) => userName) ?? [];
    const selectedSeller = expenses?.filter(({ user }) => user?.userName === sellectedSeller);

    // Extract the list of item names from the selected seller
    const sellerItems = selectedSeller?.flatMap(({ item }) => item.name) ?? [];

    // Filter and map items in a single step
    const itemOptions =
        items?.reduce((acc, { name }) => {
            if (sellerItems.includes(name)) {
                acc.push(name);
            }
            return acc;
        }, [] as string[]) ?? [];

    // Dynamically create listItems based on selected seller and item
    const listItems: IItemPrintOut[] = useMemo(() => {
        if (!sellectedSeller || !expenses || !activeTab) return [];

        // Parse dates
        const parsedFromDate = parse(fromDate, 'dd-MM-yyyy', new Date());
        const parsedToDate = parse(toDate, 'dd-MM-yyyy', new Date());

        const filteredData = expenses.filter(({ user, type, createdAt, item }) => {
            const expenseDate = new Date(createdAt ?? '').toLocaleDateString('en-CA');
            const parseExpenseDate = parseISO(expenseDate);

            // Ensure dates are parsed correctly and use isWithinInterval
            const isDateValid = isWithinInterval(parseExpenseDate, {
                start: parsedFromDate,
                end: parsedToDate,
            });

            return (
                user.userName === sellectedSeller &&
                type === activeTab &&
                isDateValid &&
                (!selectedItem || item.name === selectedItem)
            );
        });

        // If no item is selected, return all items for the seller
        if (!selectedItem) {
            return filteredData
                .map(({ item, quantity, amount }) => ({
                    item: item.name,
                    quantity,
                    totalTK: amount,
                }))
                .reduce((acc: IItemPrintOut[], curr) => {
                    const existingItem = acc.find((i) => i.item === curr.item);
                    if (existingItem) {
                        existingItem.quantity += curr.quantity;
                        existingItem.totalTK += curr.totalTK;
                    } else {
                        acc.push(curr);
                    }
                    return acc;
                }, []);
        }

        // If an item is selected, group by origin and return counts for that item
        return filteredData
            .map(({ item, origin, quantity, amount }) => ({
                item: item.name,
                origin: origin?.name, // Add origin if item is selected
                quantity,
                totalTK: amount,
            }))
            .reduce((acc: IItemPrintOut[], curr) => {
                const existingOrigin = acc.find(
                    (i) => i.item === curr.item && i.origin === curr.origin,
                );
                if (existingOrigin) {
                    existingOrigin.quantity += curr.quantity;
                    existingOrigin.totalTK += curr.totalTK;
                } else {
                    acc.push(curr);
                }
                return acc;
            }, []);
    }, [sellectedSeller, selectedItem, expenses, activeTab, fromDate, toDate]);

    const totalQuantity = listItems.reduce((total, item) => total + item.quantity, 0);
    const totalTK = listItems.reduce((total, item) => total + item.totalTK, 0);

    return {
        listItems,
        itemOptions,
        sellerOptions,
        totalQuantity,
        totalTK,
    };
};

export default useSellerLogicsForPrintPage;
