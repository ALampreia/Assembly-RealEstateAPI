import { Name } from './name';

export interface User {
    id: number;
    name: Name;
    dateOfBirth?: Date;
    gender: string;
    photoFileName: string;
    isActive: boolean;
}