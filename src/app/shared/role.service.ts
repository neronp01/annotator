// Programmeur: Pascal Néron
// Date: 2017-11-17
// Révisuer: nom
// Cette classe de type service permet de donner aux modules tous l'information relatif aux rôles d'un utilisateur.
// Celle-ci va chercher les données dans les colections fournies par FireStore.


import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';


export interface IRole { // interface de data dans la collection roles
  id: string;
  administrateurSys ?: boolean;
  administrateur ?: boolean;
  annotateur ?: boolean;
}
export interface Item { id: string; data: IRole } // interface de la collection annotateur
@Injectable()
export class RoleService {
  RoleDoc:  AngularFirestoreDocument<IRole>; // Observable parcourrant la collection
  annotateurCollection: AngularFirestoreCollection<IRole>; // Observable parcourrant un documet d'une colection
  constructor(private dbc: AngularFirestore) { }
  // Cette fonction retourne un observable qui est la liste des roles d'un utilisateur
  tabRoles(courriel: string): Observable<IRole[]> {
    let tabAnnotateur = new Observable<IRole[]>();
    this.annotateurCollection = this.dbc.collection('roles', ref => {
      return ref.where('id', '==', courriel)
    });
    return tabAnnotateur = this.annotateurCollection.valueChanges();
  }

  // Cette fonction retourne un observable qui la liste de tous les utilisateur
  get _tabRoles(): Observable<IRole[]> {
    let tabAnnotateur = new Observable<IRole[]>();
    this.annotateurCollection = this.dbc.collection('roles');
    return tabAnnotateur = this.annotateurCollection.valueChanges();
  }
  // Cette fonction ajoute le role annotateur à un utilisateur
  addRoleAnnotateur( id: string , data: IRole ) {
    const item: Item = { id, data };
    this.annotateurCollection = this.dbc.collection('roles/');
    this.annotateurCollection.add(item);
  }
  // Cette fonction change le role d'un utilisateur.
  updateRole( id: string, dataRole: IRole, uid: string) {
    const data = dataRole;
    const item: Item = { id, data };
    this.RoleDoc = this.dbc.doc<IRole>('roles/' + uid);
    this.RoleDoc.update(item)
  }
// Cette fonction retourne un observable permetant de trouver un UID. Cette UID est
// la clef pouvant récupérer un document d'une colection.
  get trouverUid(): AngularFirestoreCollection<IRole> {
    let tabRole: AngularFirestoreCollection<IRole>;
    this.annotateurCollection = this.dbc.collection('roles')
    tabRole = this.annotateurCollection;
    return tabRole;
  }
}
