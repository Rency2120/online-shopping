import { Sequelize } from 'sequelize';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from '../config/index';
import Category, { initializeCategory } from '../models/categoryModel';
import Product, { initializeProduct } from '../models/Product.Model';
import SubCategory, { initializsubCategory } from '../models/subCategoryModel';
import ProductVariant, { initializeProductVariant } from '@/models/productVariant.Model';
import Discount, { initializeDiscount } from '@/models/discount.model';
import DiscountProduct, { initializeDiscountProduct } from '@models/discountProduct.model';
import DiscountCategory, { initializeDiscountCategory } from '@models/discountCategory.model';
import DiscountSubCategory, { initializeDiscountsubCategory } from '@models/discountSubCategory.model';
import Cart, { initializeCart } from '@/models/cart.Model';
import CartItem, { initializeCartItem } from '@/models/cartItem.model';
import Users, { initializeUsers } from '@/models/user.Model';
import Wishlist, { initializeWishlist } from '@/models/wishlist.Model';
import Order, { initializeOrder } from '@/models/order.Model';
import ShippingCost, { initializeShippingCost } from '@/models/shipping.Model';
import Payment, { initializePayment } from '@/models/payment.model';
import Notification, { initializeNotification } from '@/models/notification.model';
import Review, { initializeReview } from '@/models/reviwe.model';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
});

const db: { [key: string]: any } = {
  Users,
  SubCategory,
  Category,
  Product,
  ProductVariant,
  DiscountCategory,
  DiscountProduct,
  DiscountSubCategory,
  Discount,
  Cart,
  CartItem,
  Wishlist,
  Order,
  ShippingCost,
  Payment,
  Notification,
  Review

};
initializeUsers(sequelize);
initializeCategory(sequelize);
initializsubCategory(sequelize);
initializeProduct(sequelize);
initializeProductVariant(sequelize);
initializeDiscountCategory(sequelize);
initializeDiscountProduct(sequelize);
initializeDiscountsubCategory(sequelize);
initializeDiscount(sequelize);
initializeCart(sequelize);
initializeCartItem(sequelize);
initializeWishlist(sequelize);
initializeOrder(sequelize);
initializeShippingCost(sequelize);
initializePayment(sequelize);
initializeNotification(sequelize);
initializeNotification(sequelize);
initializeShippingCost(sequelize)
initializeReview(sequelize)

Object.values(db).forEach(model => {
  if (model.associate) {
    console.log(`Associating ${model.name}`);
    model.associate(db);
  }
});

export default sequelize;
