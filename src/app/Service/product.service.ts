import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';


const API_PRODUCT = environment.apiBaseLink + '/api/product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(
    private http:HttpClient,
    ) { }
    
    getAllProducts( ){
      return this.http.get<{success: boolean; data: Product[]; count: number}>(API_PRODUCT+ '/get-all-products')
    }
    
    postProduct( data: any ){
      return this.http.post<{success: boolean; data: Product[]; count: number}>(API_PRODUCT + '/add-product', data);
    }
    deleteProductById(id: string) {
      return this.http.delete<{ message: string }>(API_PRODUCT + '/delete-product-by-id/' + id);
    }
    getSingleProductById(id: string) {
      return this.http.get<{ data: any, message: string }>(API_PRODUCT + '/get-product-by-product-id/' + id);
    }
    editProductById(data: any) {
      return this.http.put<{ message: string }>(API_PRODUCT + '/edit-product-by-id', data);
    }

    getSingleProductBySlug(slug: string) {
      return this.http.get<{ data: any, message: string }>(API_PRODUCT + '/get-single-product-by-slug/' + slug);
    }
}
