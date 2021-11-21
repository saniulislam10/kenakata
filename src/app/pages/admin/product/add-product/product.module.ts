import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProductComponent } from './product.component';
import { ImageCropComponent } from '../image-crop/image-crop.component';


@NgModule({
  declarations: [
    ProductComponent,
    ImageCropComponent
  ],
  imports: [
    ImageCropperModule,
    CommonModule,
    ProductRoutingModule,
    MaterialModule
  ]
})
export class ProductModule { }
