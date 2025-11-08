import {ListingStatus} from './listing-status.enum';

export interface Listing{
    id: number;
    type: string;
    listingStatus: ListingStatus;
    numberOfRooms?: number;
    numberOfBathrooms?: number;
    numberOfKitchens?: number;
    price: number;
    location: string;
    area: number;
    parking?: number;
    description: string;
    mainImageFileName: string;
    otherImagesFileNames: string;
    agentId: number;
}