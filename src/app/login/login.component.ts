import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';



import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() _isloggedIn = new EventEmitter<boolean>();
  texteSelection = [{nomParent: 'adnotatio'}, {nomTexte: 'fonctions2.txt'}];
  parent = 'index';
  message: string;
  authState: any = null;
  constructor(public authService: AuthService, public router: Router, public afAuth: AngularFireAuth) {
    this.setMessage();
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }
  ngOnInit() {
  }
  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  //  console.log(this.message);
    if (this.message === 'Logged in') {
   //   this._isloggedIn = true;
    }else {
   //   this._isloggedIn = false;
    }
  }

  login(e) {
    this.authService.googleLogin().then((data) => {
      this.router.navigate(['/home'])});
  }

  logout(e) {
    this._isloggedIn.emit(e);
    this.authService.logout();
    this.setMessage();
    console.log(e);
  }
  get authenticated(): boolean {
    return this.authState !== null;
  }
  get currentUserId(): string {
    return this.authenticated ? this.authState.displayName : '';
  }

  googleLogin() {
    this.authService.googleLogin().then((data) => {
      this.router.navigate(['/home'])});
    //  return this.se.googleLogin();
  }
  facebookLogin() {
    return this.authService.facebookLogin();
  }
  twitterLogin() {

    return this.authService.twitterLogin().then((data) => {
      this.router.navigate(['/home'])});
  }
  getAuth() {
    console.log(this.authService.currentUserId);
  }
}
