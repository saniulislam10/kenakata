import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent,
  },
  {
    path: 'products/:slug', 
    loadChildren: () => import('../product-details/product-details.module').then(m => m.ProductDetailsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
