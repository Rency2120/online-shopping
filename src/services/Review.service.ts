import { HttpException } from "@/exceptions/httpException";
import Review from "@/models/reviwe.model";
import { Service } from "typedi";
import CartItem from "@/models/cartItem.model";
import Cart from "@/models/cart.Model";


@Service()
export class ReviewService{
    public async createReview(userId:string,productId:string,rating:number,comment:string,images:string[]){
        try{
            const checkPurchase=await this.verifyPurchase(userId,productId)
            if(!checkPurchase){
                throw new HttpException(400,"You must purchase the product to review it")
            }
            if(rating<1 || rating>5){
                throw new HttpException(400,"Rating must be between 1 and 5")
            }
            if(!comment.trim()){
                throw new HttpException(400,"Comment is required")
            }
            console.log("Creating review with data:", {
                userId,
                productId,
                rating,
                comment,
                images
            });
            const existingReview=await Review.findOne({where:{user_id:userId,product_id:productId}})
            if(existingReview){
                throw new HttpException(400,"You have already reviewed this product")
            }
            const review=await Review.create({user_id:userId,product_id:productId,rating,comment,images})
            return review;
        }catch(error){
            console.error("Review creation error:", error);
            throw new HttpException(
                error.status || 500,
                error.message || "Failed to create review"
            );
        }
    }
    public async verifyPurchase(userId: string, productId: string) {
        const order = await Cart.findOne({
            where: { 
                user_id: userId
            },
            include: [{
                model: CartItem,
                where: {
                    Product_id: productId
                }
            }]
        });
        console.log("order",order)
        return order ? true : false;
    }


    public async getProductReviews(productId:string){
        try{

            const reviews=await Review.findAll({where:{product_id:productId}})
            return reviews
        }catch(error){
            console.error("Review fetching error:", error);
            throw new HttpException(500,error.message || "Error in GetProductReviews");
        }
    }
    public async getUserReviews(userId:string){
        const reviews=await Review.findAll({where:{user_id:userId}})
        return reviews
    }

    public async getReviewById(reviewId:string){
        const review=await Review.findByPk(reviewId)
        return review
    }

    public async updateReview(reviewId:string,rating:number,comment:string,images:string[]){
        const review=await Review.findByPk(reviewId)
        if(!review){
            throw new HttpException(400,"Review not found")
        }
        review.rating=rating
        review.comment=comment
        review.images=images
        await review.save()
        return review
    }   
    public async deleteReview(reviewId:string){
        const review=await Review.findByPk(reviewId)
        if(!review){
            throw new HttpException(400,"Review not found")
        }
        await review.destroy()
    }
    public async getProductRatingStats(productId:string){
        const reviews=await Review.findAll({where:{product_id:productId}})
        console.log("reviews",reviews)
        const totalReviews=reviews.length
        if(totalReviews===0){
            return {totalReviews,averageRating:0}
        }
        const totalRating=reviews.reduce((sum,review)=>sum+review.rating,0)
        const averageRating=totalRating/totalReviews
        return {totalReviews,averageRating}
    }
}