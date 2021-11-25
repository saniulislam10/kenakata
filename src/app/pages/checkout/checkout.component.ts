import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cart } from 'src/app/interfaces/cart';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { CartService } from 'src/app/Service/cart.service';
import { ReloadService } from 'src/app/Service/reload.service';
import { UserDataService } from 'src/app/Service/user-data.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  orderItems : Cart[];
  user: User;
  subtotal: number;
  total: number;
  shippingCharge: number;
  order: Order;

  constructor(
    private cartService: CartService,
    private userDataService: UserDataService ,
    private reloadService: ReloadService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.shippingCharge = 60;
    this.reloadService.refreshUser$.subscribe(() => {
      this.getLoggedInUserInfo();
    });
    
    this.reloadService.refreshProduct$
    .subscribe(() => {
      this.getOrderItems();
      this.subtotal = this.totalCartAmount;
    });
    this.getLoggedInUserInfo();
    this.getOrderItems();
    this.subtotal = this.totalCartAmount;
  }

  private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  getOrderItems(){
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.orderItems = res.data;
        this.subtotal = this.totalCartAmount;
        this.total = this.subtotal + this.shippingCharge;
      })
  }

  get totalCartAmount(): number {
    if (this.orderItems && this.orderItems.length > 0) {
      return this.orderItems.map((t: Cart) => {
        const product = t.product as Product;
        const totalCartAmount = product.price * t.selectedQty;
        return totalCartAmount;
      }).reduce((acc: any, value: any) => acc + value, 0);
    } else {
      return 0;
    }
  }

  submitOrder() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '400px',
      data: {
        title: 'Confirm Order',
        message: 'Are you sure you want place your order?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.confirmOrder();
      }
    });
  }

  confirmOrder(){
    let order = {
      
    }
  }
}
