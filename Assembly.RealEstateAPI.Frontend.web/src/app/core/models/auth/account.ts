export interface Account{
    id: number;
    passwordHash: string;
    passwordSalt: string;
    email: string;
}