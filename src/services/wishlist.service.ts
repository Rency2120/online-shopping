import { WishlistAttributes } from '@/models/wishlist.Model';
import { HttpException } from '@/exceptions/httpException';
import { Service } from 'typedi';
import Wishlist from '@/models/wishlist.Model';
import Product from '@/models/Product.Model';
import ProductVariant from '@/models/productVariant.Model';

@Service()
export class WishlistService {
  public async addProductToWishlist(userId: number, productId: number): Promise<WishlistAttributes> {
    const existingItem = await Wishlist.findOne({ where: { user_id: userId, product_id: productId } });

    if (existingItem) {
      return existingItem;
    }
    const wishlistItem = await Wishlist.create({ user_id: userId, product_id: productId });
    return wishlistItem;
  }

  public async getWishlist(userId: number) {
    const wishlistItems = await Wishlist.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: 'products', include: [{ model: ProductVariant, as: 'variants' }] }],
    });
    if (!wishlistItems) {
      throw new HttpException(404, 'Error fetching wishlist');
    }
    return wishlistItems;
  }

  public async removeProductFromWishlist(userId: number, productId: number) {
    const deleted = await Wishlist.destroy({
      where: { user_id: userId, product_id: productId },
    });
    if (!deleted) throw new HttpException(404, 'Wishlist entry not found');
    return { message: 'Product removed from wishlist' };
  }
}
