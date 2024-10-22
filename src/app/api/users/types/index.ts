export type TUserPayload = {
    id?: string;
    userName: string;
    email?: string;
    password: string;
    role: 'ADMIN' | 'USER';
};
export type TUserRespone = {
    id: string;
    userName: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
    updatedAt: string;
};
