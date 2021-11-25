import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './image-cropper/image-crop.component';
import { EditProfieComponent } from './edit-profie/edit-profie.component';



@NgModule({
  declarations: [
    ProfileComponent,
    ImageCropperComponent,
    EditProfieComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    ImageCropperModule
  ]
})
export class ProfileModule { }
