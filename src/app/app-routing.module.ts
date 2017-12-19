import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import {FrameComponent} from './frame/frame.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppComponent } from './app.component';

import { CanDeactivateGuard } from './shared/can-deactivate-guard.service';
import { AuthGuard } from './shared/auth-guard.service';
import { SelectivePreloadingStrategy } from './shared/selective-preloading-strategy.service';

const appRoutes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'home', component: FrameComponent, canActivate: [AuthGuard] },
  // otherwise redirect to home
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    [ RouterModule.forRoot(appRoutes,
      {
        enableTracing: true, // <-- debugging purposes only
        preloadingStrategy: SelectivePreloadingStrategy,

      }) ]
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanDeactivateGuard,
    SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule { }


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
