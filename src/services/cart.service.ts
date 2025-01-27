import { HttpException } from '@/exceptions/httpException';
import Cart from '@/models/cart.Model';
import CartItem from '@/models/cartItem.model';
import Product from '@/models/Product.Model';
import ProductVariant from '@/models/productVariant.Model';
import { Service } from 'typedi';

@Service()
export class CartService {
  public async addToCart(userId: number, products: { productId: number; variantId: number; quantity: number }[]) {
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    for (const { productId, variantId, quantity } of products) {
      const existingCartItem = await CartItem.findOne({
        where: { cart_id: cart.id, Product_id: productId, ProductVariant_id: variantId },
      });

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
      } else {
        await CartItem.create({
          cart_id: cart.id,
          Product_id: productId,
          ProductVariant_id: variantId,
          quantity,
        });
      }
    }
    return cart;
  }

  public async getCart(userId: number) {
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: {
        model: CartItem,
        include: [
          {
            model: Product,
          },
          {
            model: ProductVariant,
            as: 'variant',
          },
        ],
      },
    });

    console.log('cart', cart);

    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartResponse = {
      id: cart.id,
      user_id: cart.user_id,
      CartItems: cart.CartItems.map(item => ({
        cart_id: item.cart_id,
        quantity: item.quantity,
        Product: {
          id: item.Product.id,
          name: item.Product.name,
        },
        ProductVariant: item.variant
          ? {
              id: item.variant.Variant_id,
              variantName: item.variant.variantName,
              image: item.variant.image,
              size: item.variant.size,
              price: item.variant.price,
            }
          : null,
      })),
    };

    return cartResponse;
  }

  public async updateCartItemQuantity(cartItemId: number, newQuantity: number) {
    console.log('cartItemId', cartItemId);
    const cartItem = await CartItem.findByPk(cartItemId);
    if (cartItem) {
      cartItem.quantity = newQuantity;
      await cartItem.save();
      return cartItem;
    }
    throw new HttpException(404, 'Cart item not found');
  }

  async removeCartItem(cartItemId: number) {
    const cartItem = await CartItem.findByPk(cartItemId);
    if (cartItem) {
      await cartItem.destroy();
      return { message: 'Cart item removed successfully' };
    }
    throw new HttpException(404, 'Cart item not found');
  }

  async emptyCart(userId: number) {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (cart) {
      await CartItem.destroy({ where: { cart_id: cart.id } });
      return { message: 'Cart emptied successfully' };
    }
    throw new HttpException(404, 'Cart not found');
  }
}
