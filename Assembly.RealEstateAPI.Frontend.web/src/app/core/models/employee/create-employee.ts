import { CreatePerson } from '../shared/create-person';

export interface CreateEmployee extends CreatePerson{
    hiredDate?: Date;
    dateOfTermination?: Date;
}