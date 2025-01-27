export interface IReview {
    id: number;
    user_id: string;
    product_id: string;
    rating: number;
    comment: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IReviewStats {
    totalReviews: number;
    averageRating: number;
}

export interface IReviewCreation extends Omit<IReview, 'id' | 'createdAt' | 'updatedAt'> { }
