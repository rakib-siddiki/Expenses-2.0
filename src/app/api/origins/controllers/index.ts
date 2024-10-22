import { db, errorResponse, successResponse, zodErrorResponse } from '@/app/api/helpers';
import { TOriginPayload } from '../types';
import { OriginSchema } from '../validations';

// Create a new origin
export const onCreateOrigin = async (payload: TOriginPayload) => {
    try {
        const { error } = OriginSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);

        // Check if the origin already exists for the same item
        const isOriginExisting = await db.origin.findFirst({
            where: {
                OR: [
                    { name: { equals: payload.name, mode: 'insensitive' } },
                    { name: { equals: payload.name, mode: 'insensitive' }, itemId: payload.itemId },
                ],
            },
        });

        if (isOriginExisting)
            return errorResponse('Origin already exists for this item or name', 400);

        // Create the origin
        const origin = await db.origin.create({ data: payload });
        if (!origin) return errorResponse('Origin creation failed', 404);

        return successResponse(origin, 'Origin created successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find all origins
export const onFindOrigins = async () => {
    try {
        const origins = await db.origin.findMany({
            include: {
                item: true,
                stock: true,
            },
        });
        if (!origins || origins.length === 0) return errorResponse('No origins found', 200);

        return successResponse(origins, 'Origins fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Find a single origin by id
export const onFindOrigin = async (id: string) => {
    try {
        const origin = await db.origin.findUnique({ where: { id } });
        if (!origin) return errorResponse('Origin not found', 404);

        return successResponse(origin, 'Origin fetched successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Update an origin
export const onUpdateOrigin = async (id: string, payload: TOriginPayload) => {
    try {
        const { error } = OriginSchema.safeParse(payload);
        if (error) return zodErrorResponse(error);
        // Check if origin exists
        const existingOrigin = await db.origin.findUnique({
            where: { id },
        });

        if (!existingOrigin) return errorResponse('Origin not found', 404);

        // Check if the origin name already exists for the same item
        const existingOriginName = await db.origin.findFirst({
            where: {
                name: payload.name,
                itemId: payload.itemId,
                NOT: { id }, // Ensure it's not the same origin we are updating
            },
        });
        if (existingOriginName) return errorResponse('Origin already exists for this item', 400);

        // Update the origin
        const origin = await db.origin.update({
            where: { id },
            data: payload,
        });
        if (!origin) return errorResponse('Origin update failed', 404);

        return successResponse(origin, 'Origin updated successfully');
    } catch (error) {
        return errorResponse('Internal server error', 500);
    }
};

// Delete an origin
export const onDeleteOrigin = async (id: string) => {
    try {
        const existingOrigin = await db.origin.findUnique({
            where: { id },
            include: {
                item: true,
            },
        });
        if (!existingOrigin) return errorResponse('Origin not found', 404);

        await db.origin.delete({ where: { id } });
        return successResponse('Origin deleted successfully');
    } catch (error) {
        return errorResponse('Failed to delete origin', 500);
    }
};
