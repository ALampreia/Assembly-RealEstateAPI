import {ContactType} from '../contacts/contact-type.enum';

export interface CreatePersonalContactDetails{
    contactType: ContactType;
    value: string;
}