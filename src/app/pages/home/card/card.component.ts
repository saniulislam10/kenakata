import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/Service/cart.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() product: Product;
  qty: number;
  price: string;

  constructor(
    private cartService : CartService,
  ) { }

  ngOnInit(): void {
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
