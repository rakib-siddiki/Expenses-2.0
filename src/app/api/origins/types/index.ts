export type TOriginPayload = {
    id?: string;
    name: string;
    itemId: string; // Foreign key relation to the Item
};

export type TOriginResponse = {
    id: string;
    name: string;
    itemId: string;
    createdAt: string;
    updatedAt: string;
};
