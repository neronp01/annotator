import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';



export interface IMot {
  id: number; // position dans le text
  data: IMotData;
}
export interface IMotData {
  id: number; // position dans le text
  mot ?: string;
  x ?: number;
  y ?: number;
  phrase ?: number;
  texte ?: string;
  categorie ?: Array<string>;
}

@Injectable ()
export class TexteServiceService {
  motCollection: AngularFirestoreCollection<IMot>;
  motDoc:  AngularFirestoreDocument<IMot>;
  motList: Observable<IMot[]>;
  constructor(private dbc: AngularFirestore) { }

// Cette fontion retourne une liste de mot selon un texte choisi dans la bd
  getTExt(texte: string): Observable<IMot[]> {
    let tabAnnotateur: Observable<IMot[]>;
    this.motCollection = this.dbc.collection('mots', ref => {
      return ref.where('data.texte', '==', texte).orderBy('data.id');
    });
    this.motList =  this.motCollection.valueChanges();
    tabAnnotateur = this.motList;
    return tabAnnotateur;
  }

  readWordCategory(id: number):  Observable<IMot[]> {
    let motTemp:  Observable<IMot[]>;
    this.motCollection = this.dbc.collection<IMot>('mots', ref => {
      return ref.where('data.id', '==', id);
    });
    this.motList = this.motCollection.valueChanges();
    return motTemp = this.motList;
  }
  get trouverUid(): AngularFirestoreCollection<IMot> {
    let tabMot: AngularFirestoreCollection<IMot>;
    this.motCollection = this.dbc.collection('mots')
    tabMot = this.motCollection;
    return tabMot;
  }
  updateMot( dataAnnotaeur: IMotData, path: string, change: Array<string> ) {
    const id = dataAnnotaeur.id;
    const data = this.mot(dataAnnotaeur['data'], change);
    const item: IMot = { id, data };
    this.motDoc = this.dbc.doc<IMot>('mots/' + path);
    this.motDoc.update(item);
  }
  mot(e : IMotData, categorie: Array<string>): IMotData {
    const mots = {
      id: e.id, mot: e.mot, x : e.x, y : e.y, phrase: e.phrase, texte: e.texte, categorie: categorie
    }
    return mots;
  }
}
