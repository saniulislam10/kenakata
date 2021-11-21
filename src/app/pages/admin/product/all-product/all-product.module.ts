import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllProductRoutingModule } from './all-product-routing.module';
import { AllProductComponent } from './all-product.component';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AllProductComponent
  ],
  imports: [
    CommonModule,
    AllProductRoutingModule,
    MaterialModule,
    NgxPaginationModule
  ]
})
export class AllProductModule { }
