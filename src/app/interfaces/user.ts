import { Cart } from "./cart";

export interface User {
    _id?: any,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    password: string,
    username: string,
    createdAt? : any,
    carts?: string | Cart[],
    profileImg?: string,
}
