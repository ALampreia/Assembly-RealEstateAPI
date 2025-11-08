import {Name} from './name';

export interface Person {
    id: number;
    name: Name;
    dateOfBirth?: Date;
    gender: string;
    photoFileName: string;
    isActive: boolean;
}