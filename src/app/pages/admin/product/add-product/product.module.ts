import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProductComponent } from './product.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductComponent,
    UploadImageComponent
  ],
  imports: [
    ImageCropperModule,
    CommonModule,
    ProductRoutingModule,
    MaterialModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProductModule { }
