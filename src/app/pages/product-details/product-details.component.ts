import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/Service/cart.service';
import { ProductService } from 'src/app/Service/product.service';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;

  slug: string = null;
  product: Product = null;
  qty: number = null;
  price: string = null;
  user: string;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {


    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.slug = param.get('slug');

      if (this.slug) {
        this.getProductBySlug(this.slug);
        console.log(this.product);
      }
    });

  }

  getProductBySlug(slug: any) {
    this.productService.getSingleProductBySlug(slug)
      .subscribe(res => {
        this.product = res.data;
      })
  }

  addToCart() {
    this.qty = 1;
    this.price = this.product.price * this.qty + " "; 
    let data = {
      product : this.product,
      selectedQty: this.qty,
      priceId : this.price,
    }
    
    console.log(data);
      
    this.cartService.addItemToUserCart(data)
      .subscribe(res => {
        console.log(res.message);
      })



  }


}
