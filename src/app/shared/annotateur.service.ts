// Programmeur: Pascal Néron
// Date: 2017-11-17
// Révisuer: nom
// Cette classe de type service permet de donner au module tous l'information relatif aux annotateurs.
// Celle-ci va chercher les données dans les colections fournies par FireStore.




import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface IAnnotateur { // interface de data dans la collection annotateur
  id: string;
  administrateur ?: string;
  nom ?: string;
  prenom ?: string;
  courriel ?: string;
  projets ?: Array<string>;
  textAnnotes ?: Array<string>;
  photo ?: string;
}

export interface Item { id: string; data: IAnnotateur; } // interface de la collection annotateur
@Injectable()
export class AnnotateurService {
    annotateurCollection: AngularFirestoreCollection<IAnnotateur>; // Observable parcourrant la collection
  annotateurDoc:  AngularFirestoreDocument<IAnnotateur>; // Observable parcourrant un documet d'une colection
  annotatateurList: Observable<IAnnotateur[]>;
  itemCollection: AngularFirestoreCollection<Item>;
  itemsList: Observable<Item[]>;
  annotateur = [];



  constructor(private dbc: AngularFirestore) {
  }
  // Cette fonction n'est actuelement pas utilisé
  trouverAnnotateur(courriel: string): AngularFirestoreCollection<IAnnotateur> {
    let tabAnnotateur: AngularFirestoreCollection<IAnnotateur>;
    this.annotateurCollection = this.dbc.collection('roles', ref => {
      return ref.where('email', '==', courriel);
    });
    tabAnnotateur = this.annotateurCollection;
    return tabAnnotateur;
  }
  // Cette fonction permet de trouver une liste d'annotateur d'un administrateur.
  trouverListeAnnotateur(courriel: string): Observable<IAnnotateur[]> {
    let tabAnnotateur: Observable<IAnnotateur[]>;
    this.annotateurCollection = this.dbc.collection('annotateurs', ref => {
      return ref.where('data.administrateur', '==', courriel);
    });
    this.annotatateurList =  this.annotateurCollection.valueChanges();
    tabAnnotateur = this.annotatateurList;
    return tabAnnotateur = this.annotatateurList;
}
// Cette fonction enlève de la collection un annotateur appartenant à un administrateur.
removeAnnotateurs(courriel: string) {
  this.itemCollection = this.dbc.collection<Item>('annotateurs', ref => {
    return ref.where('data.administrateur', '==', 'administrateur@uqo.ca');
  });
  this.itemsList = this.itemCollection.valueChanges()
  ;
}
// Cette fonction ajoute une annotateur à la colection
  addAnnotateur( id: string, data: IAnnotateur) {
    const item: Item = { id, data };
    this.annotateurCollection = this.dbc.collection('annotateurs/');
    this.annotateurCollection.add(item);
  }
// Cette fonction retourne un IAnnotateur en y ajoutant les projet
  updateAnnotateurOb(annotateur: IAnnotateur, projets: Array<string>): IAnnotateur {
    const temp = { id: annotateur.id, nom : annotateur.nom, prenom: annotateur.prenom,
      courriel: annotateur.courriel, projets: projets, textAnnotes: annotateur.textAnnotes,
      administrateur: annotateur.administrateur,  photo: annotateur.photo};
    return temp;
  }
// Cette fonction met à jour les informations d'un annotateur
  updateAnnotateur( dataAnnotaeur: IAnnotateur) {
    const id = dataAnnotaeur.id;
    const data = dataAnnotaeur;
    const item: Item = { id, data };
    this.annotateurDoc = this.dbc.doc<IAnnotateur>('annotateurs/');
   // this.annotateurDoc.update(item)
  }
}


