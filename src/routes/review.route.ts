import { Router } from 'express';
import { ReviewController } from '@/controllers/review.controller';
import  {AuthMiddleware}  from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateReviewDto, UpdateReviewDto } from '@/dtos/review.dto';
import { Routes } from '@/interfaces/routes.interface';


export class ReviewRoute implements Routes{
    public path = '/reviews';
    public router = Router();
    private reviewController = new ReviewController();

    constructor(){
        this.initializeRoutes();
    }
    private initializeRoutes(){
        this.router.post(`${this.path}`,AuthMiddleware,ValidationMiddleware(CreateReviewDto),this.reviewController.createReview);
        this.router.get(`${this.path}/product/:productId`,this.reviewController.getProductReviews);
        this.router.get(`${this.path}/user`,AuthMiddleware,this.reviewController.getUserReviews);
        this.router.get(`${this.path}/:reviewId`,this.reviewController.getReviewById);
        this.router.get(`${this.path}/product/:productId/stats`,this.reviewController.getProductRatingStats);
        this.router.patch(`${this.path}/:reviewId`,AuthMiddleware,ValidationMiddleware(UpdateReviewDto),this.reviewController.updateReview);
        this.router.delete(`${this.path}/:reviewId`,AuthMiddleware,this.reviewController.deleteReview);

    }

}


