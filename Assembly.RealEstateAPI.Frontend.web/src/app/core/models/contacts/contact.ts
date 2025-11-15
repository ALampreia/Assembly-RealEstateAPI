import { ContactType } from './contact-type.enum';

export interface Contact{
    id: number;
    contactType: ContactType;
    value: string;
}