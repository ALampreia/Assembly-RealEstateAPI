import { StatusType} from './status-type.enum'

export interface Appointment{
    title: string;
    description: string;
    date: Date;
    hourStart: string;
    hourEnd: string;
    statusType: StatusType;
}