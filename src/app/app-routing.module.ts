import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from './auth-guard/user-auth.guard';
import { LogoutComponent } from './shared/components/logout/logout.component';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: "logout", 
    component: LogoutComponent
  },
  {
    path: 'admin',
    canActivate: [UserAuthGuard], 
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
