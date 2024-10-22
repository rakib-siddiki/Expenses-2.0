import { FC } from 'react';
import { ExpensePaylaod } from '@/types/expenses';
import { ItemsResponse } from '@/types/items';
import { OriginsResponse } from '@/types/origins';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { TAccountResponse } from '@/app/api/accounts/types';
import EditExpenseForm from './EditExpensesForm';

interface IEditExpenseDialog {
    editingExpense: ExpensePaylaod;
    onEdit: (updatedExpense: ExpensePaylaod) => Promise<void>;
    currentUserRole: 'ADMIN' | 'USER';
    items: ItemsResponse['data'] | undefined;
    origins: OriginsResponse['data'] | undefined;
    accounts: TAccountResponse[];
    onClose: () => void;
}
export const EditExpenseDialog: FC<IEditExpenseDialog> = ({
    editingExpense,
    onEdit,
    items,
    origins,
    accounts,
    currentUserRole,
    onClose,
}) => {
    return (
        <Dialog open={!!editingExpense} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Edit Expense</DialogTitle>
                <DialogDescription className='sr-only'>Edit expenses</DialogDescription>
                <EditExpenseForm
                    expense={editingExpense}
                    onEdit={onEdit}
                    items={items}
                    origins={origins}
                    accounts={accounts}
                    onClose={onClose}
                    currentUserRole={currentUserRole}
                />
            </DialogContent>
        </Dialog>
    );
};
