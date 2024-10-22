import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { TAccountPayload } from '../types';
import { AccountSchema } from '../validations';

// Create a new account
export const onCreateAccount = async (payload: TAccountPayload) => {
    try {
        const { error } = AccountSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);
        const isAccountExisting = await db.account.findFirst({
            where: { accountName: payload.accountName },
        });
        if (isAccountExisting) return errorResponse('Account already exists', 400);
        // Create the account
        const account = await db.account.create({ data: payload });
        if (!account) return errorResponse('Account creation failed', 404);

        return successResponse(account, 'Account created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find all accounts
export const onFindAccounts = async () => {
    try {
        const accounts = await db.account.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                accountName: true,
                balance: true,
            },
        });
        if (!accounts || accounts.length === 0) return errorResponse('No accounts found', 200);

        return successResponse(accounts, 'Accounts fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find a single account by ID
export const onFindAccount = async (id: string) => {
    try {
        const account = await db.account.findUnique({ where: { id }, include: { expenses: true } });
        if (!account) return errorResponse('Account not found', 404);

        return successResponse(account, 'Account fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update an account
export const onUpdateAccount = async (id: string, payload: TAccountPayload) => {
    try {
        const { error } = AccountSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // Check if account exists
        const existingAccount = await db.account.findUnique({
            where: { id },
        });

        if (!existingAccount) return errorResponse('Account not found', 404);

        // Update the account
        const account = await db.account.update({
            where: { id },
            data: payload,
        });
        if (!account) return errorResponse('Account update failed', 404);

        return successResponse(account, 'Account updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete an account
export const onDeleteAccount = async (id: string) => {
    try {
        const existingAccount = await db.account.findUnique({
            where: { id },
            include: {
                expenses: true,
            },
        });
        if (!existingAccount) return errorResponse('Account not found', 404);

        await db.account.delete({ where: { id } });
        return successResponse('Account deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete account', 500);
    }
};
