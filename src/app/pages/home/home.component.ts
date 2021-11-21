import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { ProductService } from 'src/app/Service/product.service';
import { UserService } from 'src/app/Service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentPage: number = 1;
  
  products: Product[];
  user: User;
  slug:string = null;
  
  constructor(
    private productService: ProductService,
    private userService: UserService,
    ) { 
  }

  ngOnInit(): void {
    this.get();
    this.user = this.userService.getUserData();
    console.log(this.user);
  }

  get(){
    this.productService.getAllProducts()
    .subscribe(res => {
      this.products= res.data;
    })
  }

}
