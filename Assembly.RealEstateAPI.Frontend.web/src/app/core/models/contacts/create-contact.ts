import { ContactType } from './contact-type.enum';

export interface CreateContact {
    contactType: ContactType;
    value: string;
}