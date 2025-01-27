import { HttpException } from '@/exceptions/httpException';
import Container, { Service } from 'typedi';
import Order from '@models/order.Model';
import CartItem from '@models/cartItem.model';
import Product from '@/models/Product.Model';
import ProductVariant from '@/models/productVariant.Model';
import { Model, Op } from 'sequelize';
import DiscountProduct from '@/models/discountProduct.model';
import Discount from '@/models/discount.model';
import { CreateDiscountDTO, DiscountAttributes } from '@/interfaces/discount.interface';
import DiscountCategory from '@/models/discountCategory.model';
import DiscountSubCategory from '@/models/discountSubCategory.model';
import SubCategory from '@/models/subCategoryModel';
import { NotificationService } from './Notification.service';
import { NotificationType } from '@/models/notification.model';
import { ShippingCostService } from './shipping.service';
import { PaymentService } from './payment.service';
@Service()
export class OrderService {
  public shipingCostService = Container.get(ShippingCostService)
  private notificationService = Container.get(NotificationService);
  private paymentService = Container.get(PaymentService)

  public async createOrderFromCart(
    userId: number,
    cartId: number,
    shippingAddress: Record<string, any>,
     paymentMethodId: string = 'pm_card_visa'

  ): Promise<Order> {

    const cartItems = await CartItem.findAll({
      where: { cart_id: cartId },
      include: [{ model: Product }, { model: ProductVariant, as: 'variant' }],
    });

    console.log("cartQuantity", cartItems.map(item => item.quantity));

    if (!cartItems || cartItems.length === 0) {
      throw new HttpException(404, 'No items found in the cart');
    }

    let totalPrice = 0;
    for (const cartItem of cartItems) {
      const productVariant = cartItem.variant;
      if (!productVariant) {
        throw new HttpException(404, 'Product variant not found');
      }

      if (productVariant.stock_left < cartItem.quantity) {
        throw new HttpException(
          400,
          `Insufficient stock for product variant ID: ${productVariant.Variant_id}`
        );
      }
    }


    const applicableDiscount = await this.getApplicableDiscount(cartItems);
    let finalPrice = 0;
    let discount_id = null;

    if (applicableDiscount) {
      discount_id = applicableDiscount.id;
      finalPrice = applicableDiscount.totalAfterDiscount;
    } else {

      finalPrice = cartItems.reduce((sum, item) =>
        sum + (item.variant?.price || 0) * item.quantity, 0
      );
    }
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCosts = await this.shipingCostService.getAllShippingCosts()
    let shippingCost = 0
    for (const cost of shippingCosts) {
      if (cost.name === 'quantity-base' && totalQuantity >= cost.quantity) {
        shippingCost = cost.cost

      }

      else if (cost.name === 'price-base' && finalPrice >= cost.order_price) {
        console.log("price-base", cost.order_price);
        console.log("finalPrice", finalPrice);
        shippingCost = cost.cost

      }
      else if (cost.name === 'both' && totalQuantity >= cost.quantity && finalPrice >= cost.order_price) {
        shippingCost = cost.cost
      }
    }
    const totalPriceWithShipping = Math.floor(Number(finalPrice)) + Math.floor(Number(shippingCost));

    console.log("totalPriceWithShipping", totalPriceWithShipping);
    console.log("shippingCost", shippingCost);
    const newOrder = await Order.create({
      user_id: userId,
      cartId: cartId,
      total_price: totalPriceWithShipping,
      status: 'Pending',
      shipping_address: shippingAddress,
      discount_id: discount_id,
      shipping_cost: shippingCost,
      tracking_number: '',
    });

    try {

      const initialPayment = await this.paymentService.createPayment(newOrder.id, 'Card', paymentMethodId);
      const confirmPayment = await this.paymentService.confirmPayment(initialPayment.id, initialPayment.transaction_id, paymentMethodId);
      console.log("initialPayment", initialPayment);
      console.log("confirmPayment", confirmPayment);
      if (confirmPayment.payment_status === "Successful") {
        await this.updateOrderStatus(newOrder.id, 'Order Confirmed');



        await this.notificationService.createOrderNotification(
          newOrder.id,
          userId,
          finalPrice,
          cartItems?.length || 0,
          'Order Confirmed'
        );

      }
      else {
        await this.updateOrderStatus(newOrder.id, 'Cancelled');
        throw new HttpException(402, 'Payment failed');
      }
      return newOrder;
    } catch (error) {
      await this.updateOrderStatus(newOrder.id, 'Cancelled');
      console.log("error", error);
      throw new HttpException(402, 'Payment failed');
    }
    
  }

  public async getApplicableDiscount(cartItems: CartItem[]): Promise<(DiscountAttributes & { totalAfterDiscount?: number }) | null> {
    console.log("getApplicableDiscount");
    console.log("Cart Items:", cartItems.map(item => ({
      productId: item.Product_id,
      quantity: item.quantity,
      price: item.variant?.price,
      totalItemPrice: (item.variant?.price || 0) * item.quantity
    })));

    let totalOriginalPrice = 0;
    let totalAfterDiscount = 0;
    let discountBreakdown: any[] = [];
    let appliedDiscountId: number | null = null;

    for (const cartItem of cartItems) {
      const itemAmount = cartItem.variant?.price * cartItem.quantity || 0;
      totalOriginalPrice += itemAmount;
      let finalItemPrice = itemAmount;
      const itemQuantity = cartItem.quantity;

      const productDiscount = await Discount.findOne({
        where: {
          is_active: true,
          [Op.or]: [
            { start_date: null, end_date: null },
            {
              start_date: { [Op.lte]: new Date() },
              end_date: { [Op.gte]: new Date() }
            }
          ]
        },
        include: [{
          model: DiscountProduct,
          as: 'products',
          where: { product_id: cartItem.Product_id },
          required: true
        }],
      });

      const currentDate = new Date();
      if (productDiscount) {
        console.log(`\nProduct ${cartItem.Product_id} Discount Details:`);
        console.log(`- Original Price: $${itemAmount}`);
        console.log(`- Discount Type: ${productDiscount.discount_type}`);
        console.log(`- Discount Value: ${productDiscount.value}${productDiscount.discount_type === 'percentage' ? '%' : '$'}`);

        const isWithinDateRange = productDiscount.start_date && productDiscount.end_date ?
          currentDate >= productDiscount.start_date && currentDate <= productDiscount.end_date : true;

        console.log(`- Date Range: ${productDiscount.start_date
          ? `${productDiscount.start_date.toLocaleDateString()} to ${productDiscount.end_date?.toLocaleDateString()}`
          : 'No date restrictions'}`);

        if (isWithinDateRange) {
          console.log('- Date Check: Within valid date range');
          if (productDiscount.unit === null || itemQuantity >= productDiscount.unit) {
            console.log('- Unit Check: Meets minimum quantity requirement');

            appliedDiscountId = productDiscount.id;
            let itemDiscount = 0;
            if (productDiscount.discount_type === 'percentage') {
              itemDiscount = (itemAmount * productDiscount.value) / 100;
            } else {
              itemDiscount = productDiscount.value;
            }
            finalItemPrice = itemAmount - itemDiscount;
            console.log(`- Discount Applied: $${itemDiscount}`);
            console.log(`- Final Price: $${finalItemPrice}`);
            discountBreakdown.push({
              discountType: 'product',
              productId: cartItem.Product_id,
              originalPrice: itemAmount,
              quantity: cartItem.quantity,
              discountApplied: itemDiscount,
              finalPrice: finalItemPrice,
              dateRange: productDiscount.start_date && productDiscount.end_date ?
                `${productDiscount.start_date.toLocaleDateString()} to ${productDiscount.end_date?.toLocaleDateString()}`
                : 'No date restrictions'
            });
          } else {
            console.log(`- Unit Check: Does not meet minimum quantity requirement of ${productDiscount.unit} units`);
          }
        } else {
          console.log(`\nNo discount found for Product ${cartItem.Product_id}`);
        }
      }

      if (!productDiscount) {
        const subCategoriesDiscount = await Discount.findOne({
          where: {
            is_active: true,
            [Op.or]: [
              { start_date: null, end_date: null },
              {
                start_date: { [Op.lte]: new Date() },
                end_date: { [Op.gte]: new Date() }
              }
            ]
          },
          include: [
            { model: DiscountSubCategory, as: 'subCategories', where: { subCategory_id: cartItem.Product?.SubCategory_id }, required: true }
          ]
        });

        if (subCategoriesDiscount) {
          console.log(`- SubCategory Discount Found for Product ${cartItem.Product_id}`);
          console.log(`- Original Price: $${itemAmount}`);
          console.log(`- Discount Type: ${subCategoriesDiscount.discount_type}`);
          console.log(`- Discount Value: ${subCategoriesDiscount.value}${subCategoriesDiscount.discount_type === 'percentage' ? '%' : '$'}`);

          const isWithinDateRange = subCategoriesDiscount.start_date && subCategoriesDiscount.end_date ?
            currentDate >= subCategoriesDiscount.start_date && currentDate <= subCategoriesDiscount.end_date : true;

          console.log(`- Date Range: ${subCategoriesDiscount.start_date
            ? `${subCategoriesDiscount.start_date.toLocaleDateString()} to ${subCategoriesDiscount.end_date?.toLocaleDateString()}`
            : 'No date restrictions'}`);

          if (isWithinDateRange) {
            console.log('- Date Check: Within valid date range for subCategory');
            if (subCategoriesDiscount.unit === null || itemQuantity >= subCategoriesDiscount.unit) {
              console.log('- Unit Check: Meets minimum quantity requirement');
              appliedDiscountId = subCategoriesDiscount.id;
              let itemDiscount = 0;
              if (subCategoriesDiscount.discount_type === 'percentage') {
                itemDiscount = (itemAmount * subCategoriesDiscount.value) / 100;
              } else {
                itemDiscount = subCategoriesDiscount.value;
              }
              finalItemPrice = itemAmount - itemDiscount;
              console.log(`- Discount Applied: $${itemDiscount}`);
              console.log(`- Final Price: $${finalItemPrice}`);
              discountBreakdown.push({
                discountType: 'subcategory',
                productId: cartItem.Product_id,
                originalPrice: itemAmount,
                quantity: itemQuantity,
                discountApplied: itemDiscount,
                finalPrice: finalItemPrice,
                dateRange: subCategoriesDiscount.start_date && subCategoriesDiscount.end_date ?
                  `${subCategoriesDiscount.start_date.toLocaleDateString()} to ${subCategoriesDiscount.end_date?.toLocaleDateString()}`
                  : 'No date restrictions'
              });
            } else {
              console.log(`- Unit Check: Does not meet minimum quantity requirement of ${subCategoriesDiscount.unit} units`);
            }
          } else {
            console.log('- Date Check: Outside valid date range for subCategory');
          }
        }

        if (!subCategoriesDiscount) {
          const categoryDiscount = await Discount.findOne({
            where: {
              is_active: true,
              [Op.or]: [
                { start_date: null, end_date: null },
                {
                  start_date: { [Op.lte]: new Date() },
                  end_date: { [Op.gte]: new Date() }
                }
              ]
            },
            include: [
              { model: DiscountCategory, as: 'categories', where: { category_id: cartItem.Product?.Category_id }, required: true }
            ]
          });

          if (categoryDiscount) {
            console.log(`- Category Discount Found for Product ${cartItem.Product_id}`);
            console.log(`- Original Price: $${itemAmount}`);
            console.log(`- Discount Type: ${categoryDiscount.discount_type}`);
            console.log(`- Discount Value: ${categoryDiscount.value}${categoryDiscount.discount_type === 'percentage' ? '%' : '$'}`);

            const isWithinDateRange = categoryDiscount.start_date && categoryDiscount.end_date ?
              currentDate >= categoryDiscount.start_date && currentDate <= categoryDiscount.end_date : true;

            console.log(`- Date Range: ${categoryDiscount.start_date
              ? `${categoryDiscount.start_date.toLocaleDateString()} to ${categoryDiscount.end_date?.toLocaleDateString()}`
              : 'No date restrictions'}`);

            if (isWithinDateRange) {
              console.log('- Date Check: Within valid date range for Category');
              if (categoryDiscount.unit === null || itemQuantity >= categoryDiscount.unit) {
                console.log('- Unit Check: Meets minimum quantity requirement');
                appliedDiscountId = categoryDiscount.id;
                let itemDiscount = 0;
                if (categoryDiscount.discount_type === 'percentage') {
                  itemDiscount = (itemAmount * categoryDiscount.value) / 100;
                } else {
                  itemDiscount = categoryDiscount.value;
                }
                finalItemPrice = itemAmount - itemDiscount;
                console.log(`- Discount Applied: $${itemDiscount}`);
                console.log(`- Final Price: $${finalItemPrice}`);
                discountBreakdown.push({
                  discountType: 'category',
                  productId: cartItem.Product_id,
                  originalPrice: itemAmount,
                  quantity: itemQuantity,
                  discountApplied: itemDiscount,
                  finalPrice: finalItemPrice,
                  dateRange: categoryDiscount.start_date && categoryDiscount.end_date ?
                    `${categoryDiscount.start_date.toLocaleDateString()} to ${categoryDiscount.end_date?.toLocaleDateString()}`
                    : 'No date restrictions'
                });
              } else {
                console.log(`- Unit Check: Does not meet minimum quantity requirement of ${categoryDiscount.unit} units`);
              }
            } else {
              console.log('- Date Check: Outside valid date range for Category');
            }
          }
        }
      }

      totalAfterDiscount += finalItemPrice;
    }

    const totalDiscount = totalOriginalPrice - totalAfterDiscount;

    if (totalDiscount > 0) {
      console.log("\n=== Final Discount Summary ===");

      const productDiscounts = discountBreakdown.filter(d => d.discountType === 'product');
      const subCategoryDiscounts = discountBreakdown.filter(d => d.discountType === 'subcategory');
      const categoryDiscounts = discountBreakdown.filter(d => d.discountType === 'category');

      const calculateTotals = (discounts: any[]) => ({
        originalTotal: discounts.reduce((sum, d) => sum + d.originalPrice, 0),
        discountTotal: discounts.reduce((sum, d) => sum + d.discountApplied, 0),
        finalTotal: discounts.reduce((sum, d) => sum + d.finalPrice, 0)
      });

      const productTotals = calculateTotals(productDiscounts);
      const subCategoryTotals = calculateTotals(subCategoryDiscounts);
      const categoryTotals = calculateTotals(categoryDiscounts);

      console.log("=== Product Discounts ===");
      console.log("Product-wise Breakdown:", productDiscounts);
      console.log(`Original Total: $${productTotals.originalTotal}`);
      console.log(`Total Discount: $${productTotals.discountTotal}`);
      console.log(`Final Total: $${productTotals.finalTotal}`);

      console.log("\n=== SubCategory Discounts ===");
      console.log("Product-wise Breakdown:", subCategoryDiscounts);
      console.log(`Original Total: $${subCategoryTotals.originalTotal}`);
      console.log(`Total Discount: $${subCategoryTotals.discountTotal}`);
      console.log(`Final Total: $${subCategoryTotals.finalTotal}`);

      console.log("\n=== Category Discounts ===");
      console.log("Product-wise Breakdown:", categoryDiscounts);
      console.log(`Original Total: $${categoryTotals.originalTotal}`);
      console.log(`Total Discount: $${categoryTotals.discountTotal}`);
      console.log(`Final Total: $${categoryTotals.finalTotal}`);

      return {
        id: appliedDiscountId,
        discount_type: 'fixed',
        value: totalDiscount,
        is_active: true,
        discountAmount: totalDiscount,
        totalAfterDiscount: totalAfterDiscount,
        breakdown: {
          product: {
            discounts: productDiscounts,
            totals: productTotals
          },
          subCategory: {
            discounts: subCategoryDiscounts,
            totals: subCategoryTotals
          },
          category: {
            discounts: categoryDiscounts,
            totals: categoryTotals
          }
        }
      } as DiscountAttributes & {
        totalAfterDiscount: number,
        breakdown: {
          product: { discounts: any[], totals: any },
          subCategory: { discounts: any[], totals: any },
          category: { discounts: any[], totals: any }
        }
      };
    }

    console.log("\nNo applicable discounts found");
    return null;
  }





  public async getOrderById(orderId: number): Promise<Order | null> {
    const order = await Order.findByPk(orderId, {
      include: ['user', 'discount'],
    });
    return order;
  }

  public async getOrdersByUser(userId: number): Promise<Order[]> {
    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
    });
    return orders;
  }

  public async updateOrderStatus(
    orderId: number, 
    status: 'Pending' | 'Order Confirmed' | 'Dispatched' | 'Shipped' | 'Delivered' | 'Cancelled'
  ): Promise<Order | null> {
    const order = await Order.findByPk(orderId);
  
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
  
  
    if (order.status === status) {
      return order;
    }
  
    order.status = status;
  
    if (status === 'Order Confirmed') {
      await this.updateInventoryForConfirmedOrder(order);
    } else if (status === 'Cancelled') {
      await this.updateInventoryForCancelledOrder(order);
    }
  
    await order.save();
  
    await this.notificationService.createNotification(
      order.user_id, 
      NotificationType.ORDER_STATUS_UPDATE,
      `Your order #${order.id} status has been updated to ${status}. Total amount: $${order.total_price}`,
      {
        orderId: order.id,
        status,
        updatedAt: new Date()
      }
    );
  
    return order;
  }
  private async updateInventoryForConfirmedOrder(order: Order): Promise<void> {
    const cartItems = await CartItem.findAll({
      where: { cart_id: order.cartId },
    });
  
    for (const cartItem of cartItems) {
      const productVariant = await ProductVariant.findByPk(cartItem.ProductVariant_id);
      if (!productVariant) {
        throw new HttpException(404, 'Product variant not found');
      }
  
      if (productVariant.stock_left < cartItem.quantity) {
        throw new HttpException(400, 'Insufficient stock for product variant');
      }
  
      productVariant.stock_left -= cartItem.quantity;
      productVariant.stock_sold += cartItem.quantity;
      await productVariant.save();
    }
  }
  
  private async updateInventoryForCancelledOrder(order: Order): Promise<void> {
    const cartItems = await CartItem.findAll({
      where: { cart_id: order.cartId },
    });
  
    for (const cartItem of cartItems) {
      const productVariant = await ProductVariant.findByPk(cartItem.ProductVariant_id);
      if (!productVariant) {
        throw new HttpException(404, 'Product variant not found');
      }
  
      productVariant.stock_left += cartItem.quantity;
      productVariant.stock_sold -= cartItem.quantity;
      await productVariant.save();
    }
  }

  public async deleteOrderById(orderId: number): Promise<void> {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new HttpException(404, 'Order not found');
    }

    await order.destroy();
  }

  public async calculateOrderTotal(cartId: number): Promise<number> {
    try {
      const cartItems = await CartItem.findAll({
        where: { cart_id: cartId },
      });

      if (!cartItems || cartItems.length === 0) {
        throw new Error('No items in cart to calculate total');
      }

      let totalPrice = 0;

      for (const cartItem of cartItems) {
        const productVariant = cartItem.Product?.variant;
        if (!productVariant) {
          throw new Error('Product variant not found');
        }
        totalPrice += productVariant.price * cartItem.quantity;
      }

      return totalPrice;
    } catch (error) {
      console.error('Error calculating order total:', error);
      throw error;
    }
  }
}
