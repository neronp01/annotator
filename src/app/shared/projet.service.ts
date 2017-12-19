import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface IProjet {
  id: string,
  nom ?: string,
}

export interface Item { id: string; data: IProjet; }

@Injectable()
export class ProjetService {
  projetCollection: AngularFirestoreCollection<IProjet>
  projetList: Observable<IProjet[]>
  constructor(private dbc: AngularFirestore) {}

  // Cette fonction permet retourne une liste de projet selon l'administrateur
  trouverListeProjet( courriel: string): Observable<IProjet[]>{
    let tabProjet: Observable<IProjet[]>;
    this.projetCollection = this.dbc.collection('projets', ref => {
      return ref.where('id', '==', courriel)
    });
    this.projetList =  this.projetCollection.valueChanges();
    return tabProjet = this.projetList;
  }
}
