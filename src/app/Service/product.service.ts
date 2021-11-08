import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';


const API_PRODUCT = environment.apiBaseLink + '/api/product';
@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(
    private http:HttpClient,
  ) { }

  postProduct( data: any ){
    return this.http.post<{success: boolean; data: Product[]; count: number}>(API_PRODUCT + '/add-product', data);
  }
}
