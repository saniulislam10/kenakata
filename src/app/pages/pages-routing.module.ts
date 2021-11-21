import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from '../auth-guard/user-auth.guard';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  { 
    path: '',
    component: PagesComponent,
    children:[
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'cart', 
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
      },
      {
        path: 'registration', 
        loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule),
      },
      {
        path: 'login', 
        loadChildren: () => import('./user/login/login.module').then(m => m.LoginModule),
      },
      {
        path: 'checkout', 
        loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
      },
      {
        path: 'profile',
        canActivate: [UserAuthGuard], 
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
    ] 
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
