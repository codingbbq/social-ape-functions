export interface User {
    email: string;
    password : string;
};

export interface Error {
    email?: string;
    password?: string;
    handle?: string;
}

export interface UserModel {
    email?: string;
    password?: string;
    confirmPassword?: string;
    handle?: string;
}