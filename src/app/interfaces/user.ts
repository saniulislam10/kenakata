import { Cart } from "./cart";

export interface User {
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
