export interface User {
    email: string;
    password : string;
};

export interface Error {
    email?: string;
    password?: string;
    handle?: string;
}

// export interface Utilities {
//     isEmpty: (str: string) => boolean;
//     isEmail: (str: string) => boolean;
// }