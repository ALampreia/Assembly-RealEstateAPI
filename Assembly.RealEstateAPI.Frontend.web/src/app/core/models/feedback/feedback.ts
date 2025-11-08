export interface Feedback{
    id: number;
    rate?: number;
    comment: string;
    commentDate?: Date;
    userId: number;
    listingId: number;
}