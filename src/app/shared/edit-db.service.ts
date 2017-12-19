import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { User } from './user.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export interface IUser { id: string; data: object; } // interface de la collection Users.
@Injectable()
export class EditDbService implements OnDestroy {
  userCollection: AngularFirestoreCollection<IUser>; // Observable parcourrant la collection.
  userDoc:  AngularFirestoreDocument<IUser>; // Observable parcourrant un documet d'une colection.
  usersList: Observable<IUser[]>;
 // listeUsers: Array<object>;
  listUsers: Array<object>;
  listeUsers: BehaviorSubject<object[]>;
  constructor(private dbc: AngularFirestore) {
    this.listeUsers = new BehaviorSubject(null);
  }
ngOnDestroy() {
    this.listeUsers.unsubscribe();
}
  // Cette fonction permet d'ajouter un user dans la collection.
  addUser( id: string, dataUser: User) {
    const data = this.buildObject(dataUser);
    const item: IUser = { id, data };
    this.userCollection = this.dbc.collection('users/');
    this.userCollection.add(item);
  }
  // Cette fonction permet de modifier les information d'un user
  updateUser( _id: string, dataUser: User, path: string) {
    const id = _id;
    const data = this.buildObject(dataUser);
    const item: IUser = { id, data };
    this.userDoc = this.dbc.doc<IUser>('users/' + path);
    this.userDoc.update(item);
  }
  deleteUser(path: string) {
    this.userDoc = this.dbc.doc<IUser>('users/' + path);
    this.userDoc.delete();
  }
  // Cette fonction retourne l'objet construit à partir d'un User
  buildObject(dataUser: User): object {
    let objTemp: object;
    objTemp = {firstName: dataUser.firstname, lastName: dataUser.lastname,
      role: dataUser.role , responsable: dataUser.responsable};
    return objTemp;
  }
  // Cette fonction permet de retourner tout la collection users
  get allUsers(): AngularFirestoreCollection<IUser> {
    let tabUser: AngularFirestoreCollection<IUser>;
    this.userCollection = this.dbc.collection('users')
    tabUser = this.userCollection;
    return tabUser;
  }
  // Cette fonction permet de faire un tableau d'objet ayant un UID ainsi que le data
  createUidAndDataList() {
    this.listUsers = [];
    let trouverUid: Observable<any>;
    trouverUid = this.allUsers.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IUser;
          const id = a.payload.doc.id;
          this.listUsers.push({id: id, data: data});
          return {id, ...data};
        });
      });
    trouverUid.subscribe(
      x => {
        this.listeUsers.next(this.listUsers);
      }
    );
  }
  getUserUid(email: string): string {
    let uid: string;
    uid = '';
    let tab: Array<object>;
    tab = this.listeUsers.getValue();
    tab.forEach( x => {
    const temp = x['data']['id'];
    if ( temp === email) {
      uid = x['id'];
    }
    });
    return uid;
  }
  getUserInf(email: string): User {
    const oldInfUser = new User();
    let tab: Array<object>;
    tab = this.listeUsers.getValue();
    tab.forEach( x => {
      const temp = x['data']['id'];
      if ( temp === email) {
        oldInfUser.firstname = x['data']['data']['firstName'];
        oldInfUser.lastname = x['data']['data']['lastName'];
        oldInfUser.role = x['data']['data']['role'];
        oldInfUser.responsable = x['data']['data']['responsable'];
      }
    });
    console.log('resp', oldInfUser);
    return oldInfUser;
  }
  getUserTabInfByRole(role: number, responsable: string): Array<object> {
    let oldInfUser: User;
    let userTab: Array<object>;
    userTab = [];
    let tab: Array<object>;
    tab = this.listeUsers.getValue();
    tab.forEach( x => {
      oldInfUser = new User();
      const tempRole = x['data']['data']['role'];
      const tempResponsable = x['data']['data']['responsable'];
      if ( tempRole === role && responsable === tempResponsable) {
        // x = {data: { data: {firstName: Pascal}}}
        oldInfUser.firstname = x['data']['data']['firstName'];
        oldInfUser.lastname = x['data']['data']['lastName'];
        oldInfUser.role = x['data']['data']['role'];
        oldInfUser.responsable = x['data']['data']['responsable'];
        userTab.push({id: x['data']['id'], data: oldInfUser});
    }
    });
    console.log('oldUser', userTab);
    return userTab;
  }
}
