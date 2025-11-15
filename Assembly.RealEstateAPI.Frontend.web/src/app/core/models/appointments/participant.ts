import { ParticipantType } from './participant-type.enum'

export interface Participant{
    id: number;
    participantType: ParticipantType;
    appointmentId: number;
    employeeId: number;
}