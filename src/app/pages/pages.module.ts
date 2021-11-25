import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { MaterialModule } from '../material/material.module';
import { SideNavbarComponent } from './admin/side-navbar/side-navbar.component';

@NgModule({
  declarations: [
    PagesComponent,
    NavbarComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule
  ]
})
export class PagesModule { }
