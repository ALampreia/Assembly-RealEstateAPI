import {Person} from '../shared/person';

export interface Employee extends Person {
    hiredDate?: Date;
    dateOfTermination?: Date;
}