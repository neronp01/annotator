import { inject, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth} from 'angularfire2/auth';
import { AuthService } from './auth.service';
import * as firebase from 'firebase';
// AuthProviders, FirebaseAuth, FirebaseAuthState



// describe('auth/', () => {
//   describe('AuthService', () => {
//     let authService;
//     let authSubject;
//     let mockFirebaseAuth;
//
//     beforeEach(() => {
//       authSubject = new Subject<firebase.User>();
//
//       mockFirebaseAuth = jasmine.createSpyObj('fbAuth', fbAuthMethods);
//       mockFirebaseAuth.subscribe.and.callFake(callback => {
//         authSubject.subscribe(callback);
//       });
//
//       TestBed.configureTestingModule({
//         providers: [
//           {provide: AngularFireAuth, useValue: mockFirebaseAuth},
//           AuthService
//         ]
//       });
//
//       inject([AuthService], (service: AuthService) => {
//         authService = service;
//       })();
//     });
//
//     it('should be defined', () => {
//       expect(authService).toBeDefined();
//     });
//
//     it('should subscribe to auth state changes', () => {
//       expect(authService.authState).toBe(null);
//
//       let authData = {
//         uid: '12345',
//         provider: new firebase.auth.GoogleAuthProvider(),
//         auth: {
//           displayName: 'John Doe',
//           providerId: 'github.com'
//         }
//       } as FirebaseAuthState;
//
//       authSubject.next(authData);
//       expect(authService.authState).toBe(authData);
//     });
//   });
// })
