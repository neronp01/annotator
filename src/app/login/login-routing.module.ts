import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../shared/auth.service';
import { AuthGuard } from '../shared/auth-guard.service';

const loginRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  }
];

@NgModule({
  imports: [

    CommonModule,
    RouterModule.forChild(loginRoutes)
  ],
  declarations: [
  ],
  providers: [ AuthService, AuthGuard ],
  exports: [
    RouterModule
  ]
})

export class LoginRoutingModule {}
