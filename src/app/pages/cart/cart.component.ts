import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cart } from 'src/app/interfaces/cart';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { CartService } from 'src/app/Service/cart.service';
import { ReloadService } from 'src/app/Service/reload.service';
import { UserService } from 'src/app/Service/user.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  user: string;
  token: string;
  total: number;

  carts: Cart[];
  products: Product[];
  currentPage: number = 1;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshProduct$
      .subscribe(() => {
        this.getAllCartProducts();
        this.total = this.totalCartAmount;
      });

    this.getAllCartProducts();
    this.total = this.totalCartAmount;
  }


  get totalCartAmount(): number {
    if (this.carts && this.carts.length > 0) {
      return this.carts.map((t: Cart) => {
        const product = t.product as Product;
        const totalCartAmount = product.price * t.selectedQty;
        return totalCartAmount;
      }).reduce((acc: any, value: any) => acc + value, 0);
    } else {
      return 0;
    }
  }

  getAllCartProducts() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.carts = res.data;
        this.total = this.totalCartAmount;
      })
  }

  addQty(cartId: any) {
    this.cartService.incrementCartQuantity(cartId)
      .subscribe(res => {
        console.log(res.message);
        this.reloadService.needRefreshProduct$();
      }, error => {
        console.log(error);
      });
  }
  subtractQty(cartId: any) {
    this.cartService.decrementCartQuantity(cartId)
      .subscribe(res => {
        console.log(res.message);
        this.reloadService.needRefreshProduct$();
      }, error => {
        console.log(error);
      });
  }

  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this product?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteProductById(id);
      }
    });
  }
  openCheckOut() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Checkout',
        message: 'Are you sure you want confirm your order'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      // this.order
    });
  }

  private deleteProductById(cartId: string) {
    console.log("Cart Id: ", cartId)
    this.cartService.removeCartItem(cartId)
      .subscribe(res => {
        console.log(res.message);
        this.reloadService.needRefreshProduct$();
      }, error => {
        console.log(error);
      });
  }



}
