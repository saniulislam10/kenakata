import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Service/product.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})


export class PagesComponent implements OnInit {
  
  
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    
  }

}
