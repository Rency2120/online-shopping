import { CreateReviewDto } from "@/dtos/review.dto";
import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { ReviewService } from "@/services/Review.service";


export class ReviewController{
    private reviewService=Container.get(ReviewService)
    public createReview = async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId=req.user.id
            const {productId,rating,comment,images}=req.body;
            const review=await this.reviewService.createReview(userId,productId,rating,comment,images)
            res.status(201).json({message:"Review created successfully",review})    
        }catch(error){
            next(error)
        }
    }
    public getProductReviews =async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const productId=req.params.productId
            const reviews=await this.reviewService.getProductReviews(productId)
            res.status(200).json({message:"Reviews fetched successfully",reviews})
        }catch(error){
            next(error)
        }
    }
    public getUserReviews =async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId=req.user.id
            const reviews=await this.reviewService.getUserReviews(userId)
            res.status(200).json({message:"Reviews fetched successfully",reviews})
        }catch(error){
            next(error)
        }
    }   

    public getReviewById =async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const reviewId=req.params.reviewId
            const review=await this.reviewService.getReviewById(reviewId)
            res.status(200).json({message:"Review fetched successfully",review})
        }catch(error){
            next(error)
        }
    }

    public getProductRatingStats =async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const productId=req.params.productId
            const stats=await this.reviewService.getProductRatingStats(productId)
            res.status(200).json({message:"Rating stats fetched successfully",stats})
        }catch(error){
            next(error)
        }
    }
    public updateReview =async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const reviewId=req.params.reviewId
            const {rating,comment,images}=req.body
            const review=await this.reviewService.updateReview(reviewId,rating,comment,images)
            res.status(200).json({message:"Review updated successfully",review})
        }catch(error){
            next(error)
        }
    }
    public deleteReview =async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const reviewId=req.params.reviewId
            await this.reviewService.deleteReview(reviewId)
            res.status(200).json({message:"Review deleted successfully"})
        }catch(error){
            next(error)
        }
    }

}