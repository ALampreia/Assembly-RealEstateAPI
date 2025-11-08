import { Name } from './name';

export interface CreatePerson {
    name: Name;
    dateOfBirth?: Date;
    gender: string;
    photoFileName: string;
    isActive: boolean;
}