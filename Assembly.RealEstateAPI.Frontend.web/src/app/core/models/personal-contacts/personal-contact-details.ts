import {ContactType} from '../contacts/contact-type.enum';

export interface PersonalContactDetails{
    id: number;
    contactType: ContactType;
    value: string;
}