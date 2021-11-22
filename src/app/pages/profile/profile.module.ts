import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './image-cropper/image-crop.component';



@NgModule({
  declarations: [
    ProfileComponent,
    ImageCropperComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    ImageCropperModule
  ]
})
export class ProfileModule { }
