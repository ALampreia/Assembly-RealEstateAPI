import { StatusType} from './status-type.enum'

export interface Appointment{
    id: number;
    title: string;
    description: string;
    date: Date;
    hourStart: string;
    hourEnd: string;
    statusType: StatusType;
}