import {User} from './user';
import {Product} from './product';
// import { OrderTimelineComponent } from '../pages/user/account/order-timeline/order-timeline.component';

export interface OrderItem {
  product: string | Product;
  price: number;
  quantity: number;
  unitType?: string;
  orderType: string;
  // deletedProduct?: any;
  // deleteDeliveryStatus?: string;
  // discountType: number;
  // discountAmount?: number;
}


export interface Order {
  _id?: string;
  user?: string | User;
  subTotal: number;
  checkoutDate?: Date;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  name: string;
  phoneNo: string;
  email: string;
  shippingAddress: string;
  orderedItems: OrderItem[];
  // orderId?: string;
  // deliveryDate?: Date;
  // deliveryStatus: number;
  // discount: number;
  // totalAmountWithDiscount: number;
  // deletedProduct: boolean;
  // refundAmount: number;
  // alternativePhoneNo?: string;
  // city: string;
  // area: string;
  // postCode: string;
  // couponId?: string | any;
  // couponValue?: number;
  // orderTimeline?: OrderTimeline;
  // hasPreorderItem?: boolean;
  // orderNotes?: string;
  // sessionkey?: string;
  // smsTemp?: object;
}

export interface OrderTimeline {
  others: boolean;
  othersData: Date;
  orderPlaced: boolean;
  orderPlacedDate: Date;
  orderProcessing: boolean;
  orderProcessingDate: Date;
  orderPickedByDeliveryMan: boolean;
  orderPickedByDeliveryManDate: Date;
  orderDelivered: boolean;
  orderDeliveredDate: Date;
}

/*




 */
