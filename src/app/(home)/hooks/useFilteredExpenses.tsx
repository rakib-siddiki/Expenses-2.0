import { useCallback, useEffect, useMemo, useState } from 'react';
import { TExpenses } from '@/types/expenses';

export function useFilteredExpenses(
    expensesData: TExpenses[],
    selectedDate: Date,
    activeTab: string,
) {
    const filterDataByDateAndTab = useCallback(
        (date: Date, tab: string) => {
            const selectedDateString = date.toLocaleDateString('en-CA');
            const filtered = expensesData?.filter((item) => {
                const itemDateString = new Date(item?.createdAt ?? '').toLocaleDateString('en-CA');
                const isSameDate = itemDateString === selectedDateString;
                const isMatchingTab = tab === 'all' || item.type === tab;
                return isSameDate && isMatchingTab;
            });
                  // Use toSorted if available, otherwise fallback to sort
        return filtered?.[typeof filtered.toSorted === 'function' ? 'toSorted' : 'sort'](
            (a, b) =>
                new Date(b?.createdAt ?? '').getTime() - new Date(a?.createdAt ?? '').getTime(),
        );
        },
        [expensesData],
    );

    const [filteredData, setFilteredData] = useState<TExpenses[]>(
        filterDataByDateAndTab(selectedDate, activeTab) ?? [],
    );

    useEffect(() => {
        setFilteredData(filterDataByDateAndTab(selectedDate, activeTab) ?? []);
    }, [filterDataByDateAndTab, selectedDate, activeTab]);

    const memorizeFilterData = useMemo(() => filteredData, [filteredData]);
    return memorizeFilterData;
}
