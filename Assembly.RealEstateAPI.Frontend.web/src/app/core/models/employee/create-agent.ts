import { CreateEmployee} from '../employee/create-employee';
import {RoleType} from './role-type.enum';

export interface CreateAgent extends CreateEmployee {
    role: RoleType;
    supervisorId?: number;
}