import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  { 
    path: '',
    component: AdminComponent,
    children:[
      {
        path: 'all-products', 
        loadChildren: () => import('./product/all-product/all-product.module').then(m => m.AllProductModule),
      },
      {
        path: 'add-product', 
        loadChildren: () => import('./product/add-product/product.module').then(m => m.ProductModule),
      },
    ] 
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
