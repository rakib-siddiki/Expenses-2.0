import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { TItemPayload } from '../types';
import { ItemSchema } from '../validations';

// Create a new item
export const onCreateItem = async (payload: TItemPayload) => {
    try {
        const { error } = ItemSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // Check if item already exists
        const isItemExisting = await db.item.findFirst({
            where: { name: payload.name },
        });

        if (isItemExisting) return errorResponse('Item already exists', 400);

        // Create the item
        const item = await db.item.create({ data: payload });
        if (!item) return errorResponse('Item creation failed', 404);

        return successResponse(item, 'Item created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find all items
export const onFindItems = async () => {
    try {
        const items = await db.item.findMany();
        if (!items || items.length === 0) return errorResponse('No items found', 200);

        return successResponse(items, 'Items fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find a single item by id
export const onFindItem = async (id: string) => {
    try {
        const item = await db.item.findUnique({ where: { id } });
        if (!item) return errorResponse('Item not found', 404);

        return successResponse(item, 'Item fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update an item
export const onUpdateItem = async (id: string, payload: TItemPayload) => {
    try {
        const { error } = ItemSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // Check if item exists
        const existingItem = await db.item.findUnique({
            where: { id },
        });

        if (!existingItem) return errorResponse('Item not found', 404);

        // Check if item name already exists for a different item
        const existingItemName = await db.item.findFirst({
            where: {
                name: payload.name,
                NOT: { id }, // Ensure it's not the same item we are updating
            },
        });
        if (existingItemName) return errorResponse('Item name already exists', 400);

        // Update the item
        const item = await db.item.update({
            where: { id },
            data: payload,
        });
        if (!item) return errorResponse('Item update failed', 404);

        return successResponse(item, 'Item updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete an item
export const onDeleteItem = async (id: string) => {
    try {
        // Check if the item exists
        const existingItem = await db.item.findUnique({
            where: { id },
            include: {
                origins: true, // Include origins to check if any are associated
            },
        });
        if (!existingItem) return errorResponse('Item not found', 404);
        // Check if there are any related origins
        if (existingItem.origins.length > 0) {
            return errorResponse(
                `Cannot delete item as it has related origins. Please delete the origins first.`,
                400,
            );
        }
        await db.item.delete({ where: { id } });
        return successResponse('Item deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete item', 500);
    }
};
