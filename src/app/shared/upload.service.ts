// Progammeur Pascal Néron
// Date 2017-11-19

import { Injectable } from '@angular/core';
import { Upload } from './upload';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';



export interface Item { id ?: string; data ?: IUpload; }

export interface IUpload {
  $key ?: string;
  administrateur ?: string;
  file ?: File;
  nom ?: string;
  url ?: string;
  size ?: number;
  progress ?: number;
  createdAt ?: Date;
  projet ?: string;
  Annotaeur ?: Array<string>;
  }

export interface IMot {
  id: string; // position dans le text
  data: IMotData;
}
export interface IMotData {
  id: number; // position dans le text
  mot ?: string;
  x ?: number;
  y ?: number;
  phrase ?: number;
  texte ?: string;
  annotation ?: Array<string>;
}



@Injectable()
export class UploadService {
  uploadsCollection: AngularFirestoreCollection<Item>;
  uploads: Observable<Item[]>;
  addMotCollection: AngularFirestoreCollection<IMot>;
  mots: Observable<IMot[]>;
  upload: IUpload;
  phraseLenght: number;

  constructor(private db: AngularFireDatabase, private readonly afs: AngularFirestore) {
    this.uploadsCollection = afs.collection<Item>('uploads');
    this.uploads = this.uploadsCollection.valueChanges();
    this.addMotCollection = afs.collection<IMot>('mots');
    this.mots = this.addMotCollection.valueChanges();
  }

  pushUpload(upload: Upload, courriel: string, projet: string) {
    upload.name = upload.file.name;
    this.saveFileData(upload, courriel, projet);
  }

  // Writes the file details to the realtime db
  private saveFileData(upload: Upload, courriel: string, projet: string) {
   // this.db.list(`uploads`).push(upload);
    const id = upload.name;
    const data = this.uploadConfig(upload, courriel, projet);
    const item: Item = {id, data};
     this.uploadsCollection.add(item);
  }

// Cette fonction analyse le texte pour enregistrer les mots dans la bd
  tabPhrase(texte: string, name: string, courriel): Array<string> {
    const tab = [];

    let phraseId: number;
    let motId: number;
    let Ylenght: number;
    Ylenght = 20;
    motId = 0;

    let phrase = '';
    const tab2 = [];
    let motCol: IMotData;
    let mot = '';
    for (let i = 0; i < texte.length; i++) {
      phrase += texte.charAt(i);
      if (texte.charAt(i) === '.') {
        tab.push(phrase);
        phrase = '';
      }
    }
    phraseId = 0;
    this.phraseLenght = 0;
    tab.forEach( x => {
      let xLargeur: number;
      xLargeur = 0;
    phraseId++;
      for (let i = 0; i < x.length; i++) {
        // 680 est la grandeur maximal de la phrase en px
        if ( this.phraseLenght > 680) {
          // 30 est la hauteur des lignes
          Ylenght += 30;
          this.phraseLenght = 0;
        }
         if ( x.charAt(i) === ',' ) {
           this.saveMot(this.setMot(motId, mot, phraseId, name, this.phraseLenght, Ylenght));
           let Xlenght = xLargeur * 15;
           this.phraseLenght += Xlenght;
           motId++;
           xLargeur = 0;
           this.saveMot(this.setMot(motId, x.charAt(i), phraseId, name, this.phraseLenght, Ylenght));
           Xlenght = 10; // met une largeur de 10px par default
           this.phraseLenght += Xlenght;
           motId++;
           mot = '';
        } else if ( x.charAt(i) === '.' ) {
           this.saveMot(this.setMot(motId, mot, phraseId, name, this.phraseLenght, Ylenght));
           let Xlenght = xLargeur * 15;
           this.phraseLenght += Xlenght;
           motId++;
           xLargeur = 0;
           this.saveMot(this.setMot(motId, x.charAt(i), phraseId, name, this.phraseLenght, Ylenght));
           Xlenght = 10; // met une largeur de 10px par default
           this.phraseLenght += Xlenght;
           motId++;
           mot = '';
        } else if (x.charAt(i) === ' ') {
           this.saveMot(this.setMot(motId, mot, phraseId, name, this.phraseLenght, Ylenght));
           let Xlenght = xLargeur * 15;
           this.phraseLenght += Xlenght;
           motId++;
           xLargeur = 0;
           this.saveMot(this.setMot(motId, x.charAt(i), phraseId, name, this.phraseLenght, Ylenght));
           Xlenght = 10; // met une largeur de 10px par default
           this.phraseLenght += Xlenght;
           motId++;
          mot = '';
        } else if (x.charAt(i) === '?') {
           this.saveMot(this.setMot(motId, mot, phraseId, name, this.phraseLenght, Ylenght));
           let Xlenght = xLargeur * 15;
           this.phraseLenght += Xlenght;
           xLargeur = 0;
           this.saveMot(this.setMot(motId, x.charAt(i), phraseId, name, this.phraseLenght, Ylenght));
           Xlenght = 10; // met une largeur de 10px par default
           this.phraseLenght += Xlenght;
           motId++;
           mot = '';
         } else if (x.charAt(i) === '') {
         } else {
          // les caractères qui prennent moins de pixel en largeur. Par défaut 1 caractère = 1;
          if (x.charAt(i) === 'i' || x.charAt(i) === 'l') {
            xLargeur += 0.3;
          } else if (x.charAt(i) === 'f' || x.charAt(i) === 't' ||  x.charAt(i) === 'r') {
             xLargeur += 0.5;
           } else {
            xLargeur += 1;
          }
          mot += x.charAt(i); }
      }
    });
      console.log(tab);
    return tab;
  }

  // Cette fonction retourne ImotData
  setMot(id: number, mot: string, phrase: number, texte: string, x: number, y: number): IMotData {
   let motData: IMotData;
    motData = {id: id, mot: mot, phrase: phrase, texte: texte, x: x, y: y};
   return motData;
  }
  // Cette fonction enregistre chaque mot dans la bd
  private saveMot(mot: IMotData) {
    const id = mot.texte;
    const data = mot;
    const item: IMot = {id, data};
     this.addMotCollection.add( item );
  }
  // Cette fonction retourne tous les information du Upload
  uploadConfig(upload: Upload, courriel: string, projet: string): IUpload {
    const temp: IUpload = {};
    temp.nom = upload.name;
    temp.size = upload['file'].size;
    temp.administrateur = courriel;
    return temp;
  }

  get infoUpload(): Observable<Item[]> {
    let uploadTab: Observable<Item[]>;
    return uploadTab = this.uploads;
  }
// Cette fonction retourne une liste des chargements de la bd
  trouverListeUpload(courriel: string): Observable<Item[]> {
    let tabUpload: Observable<Item[]>;
    this.uploadsCollection = this.afs.collection('uploads', ref => {
      return ref.where('data.administrateur', '==', courriel);
    });
    this.uploads =  this.uploadsCollection.valueChanges();
    return tabUpload = this.uploads;
  }
}
