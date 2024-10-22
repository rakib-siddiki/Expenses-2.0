import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { TUserPayload } from '../types';
import { UserSchema } from '../validations';

export const onCreateUser = async (payload: TUserPayload) => {
    try {
        const { error } = UserSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        const isUserExisting = await db.user.findFirst({
            where: { userName: payload.userName },
        });

        if (isUserExisting) return errorResponse('User already exists', 400);

        const user = await db.user.create({ data: payload });
        if (!user) return errorResponse('User creation failed', 404);

        return successResponse(user, 'User created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find all users
export const onFindUsers = async () => {
    try {
        const users = await db.user.findMany();
        if (!users || users.length === 0) return errorResponse('No users found', 200);

        return successResponse(users, 'Users fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};
// Find a user
export const onFindUser = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        if (!user) return errorResponse('User not found', 404);

        return successResponse(user, 'User fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};
// Update a user
export const onUpdateUser = async (id: string, payload: TUserPayload) => {
    try {
        const { error } = UserSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);
        // Check if the user exists
        const existingUser = await db.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return errorResponse('User not found', 404);
        }

        // Check if userName already exists for a different user
        const existingUserName = await db.user.findFirst({
            where: {
                userName: payload.userName,
                NOT: { id }, // Ensure it's not the same user we are updating
            },
        });
        if (existingUserName) {
            return errorResponse('User name already exists', 400);
        }

        const user = await db.user.update({
            where: { id },
            data: payload,
        });
        if (!user) return errorResponse('User not found', 404);

        return successResponse(user, 'User updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete a user
export const onDeleteUser = async (id: string) => {
    try {
        const existingUser = await db.user.findUnique({
            where: { id },
            include: {
                expenses: true,
            },
        });
        if (!existingUser) return errorResponse('User not found', 404);
        // Check if the user has any related expenses
        if (existingUser.expenses.length > 0) {
            return errorResponse(
                'Cannot delete user as they have related expenses. Please delete the expenses first.',
                400,
            );
        }
        await db.user.delete({ where: { id } });
        return successResponse('User deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete user', 500);
    }
};
