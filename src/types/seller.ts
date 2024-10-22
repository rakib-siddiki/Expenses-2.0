export type TSeller = {
    id: string;
    userName: string;
    email: string | null;
    password: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
    updatedAt: string;
};

export type TSellerRespone = {
    status: boolean;
    message: string;
    data: TSeller | null;
};
