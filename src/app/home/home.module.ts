import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { AuthService } from '../shared/auth.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ]
})
export class HomeModule {}
