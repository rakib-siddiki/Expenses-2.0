import { TExpenses, TExpensesResponeData } from '@/types/expenses';
import { ItemsResponse } from '@/types/items';
import { OriginsResponse } from '@/types/origins';
import { TSeller } from '@/types/seller';

interface ITransfromData {
    expenses: TExpensesResponeData[];
    items: ItemsResponse['data'] | undefined;
    origins: OriginsResponse['data'] | undefined;
    user: TSeller | null;
}
export const transfromExpensesData = ({
    expenses,
    items,
    origins,
}: ITransfromData): TExpenses[] => {
    const tranfromData = (expenses ?? []).map(
        ({ itemId, originId, stock, user, Accounts, ...rest }) => {
            const item = items?.find((item) => item.id === itemId);
            const origin = origins?.find((origin) => origin.id === originId);
            return {
                ...rest,
                itemId,
                originId,
                userId: user?.id ?? '',
                role: user?.role ?? '',
                item: item?.name ?? '',
                origin: origin?.name ?? '',
                seller: user?.userName ?? '',
                stock: stock ?? 0,
                Accounts,
            };
        },
    );

    return tranfromData;
};
