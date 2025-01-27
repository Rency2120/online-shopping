import { App } from '@/app';
// import { AuthRoute } from "@routes/auth.route";
// import { ValidateEnv } from "@utils/validateEnv";
// import { UserRoute } from "./routes/user.route";
import { CategoryRoute } from './routes/category.route';
import { routerUser } from './routes/userRoutes';
import { DiscountRouter } from './routes/discount.router';
import { SubCategoryRoute } from './routes/subCategory.route';
import { ProductRouter } from './routes/Product.Route';
import { ProductVariantRoute } from './routes/productVariant.route';
import { CartRoute } from './routes/cart.route';
import { WishlistRoute } from './routes/wishlist.route';
import { OrderRoute } from './routes/order.route';
import { ShippingRoute } from './routes/shipping.route';
import { PaymentRoute } from './routes/payment.route';
import { NotificationRoute } from './routes/notification.route';
import { ReviewRoute } from './routes/review.route';
// ValidateEnv();

const app = new App([
  // new AuthRoute(),
  // new UserRoute(),
  new CategoryRoute(),
  new routerUser(),
  new DiscountRouter(),
  new ProductRouter(),
  new SubCategoryRoute(),
  new ProductVariantRoute(),
  new CartRoute(),
  new WishlistRoute(),
  new OrderRoute(),
  new ShippingRoute(),
  new PaymentRoute(),
  new NotificationRoute(),
  new ReviewRoute()   
]);

app.listen();
