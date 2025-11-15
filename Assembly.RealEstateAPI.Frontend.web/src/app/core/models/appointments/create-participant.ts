import { ParticipantType } from './participant-type.enum'

export interface CreateParticipant{
    participantType: ParticipantType;
    appointmentId: number;
    employeeId: number;
}