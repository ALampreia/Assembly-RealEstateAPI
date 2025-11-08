import { Employee } from '../employee/employee';
import { RoleType } from './role-type.enum';

export interface Agent extends Employee{
    role: RoleType;
    supervisorId?: number;
}
