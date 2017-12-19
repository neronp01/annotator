import { TestBed, inject ,  async, ComponentFixture} from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AnnotateurService, IAnnotateur, Item } from './annotateur.service';
import * as firebase from 'firebase/app';
import {environment} from '../../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


import { FirebaseApp, FirebaseAppConfig, AngularFireModule } from 'angularfire2';

describe('AnnotateurService', () => {
  let app: firebase.app.App;
  let afs: AngularFirestore;
  let annotateurMock: IAnnotateur;
  let ann: AnnotateurService;
  annotateurMock = {id: 'administrateur@uqo.ca&annotateur@uqo.ca', nom: 'nomAnnotateur',
  prenom: 'prenomAnotateur', courriel: 'annotateur@uqo.ca', administrateur: 'administrateur@uqo.ca'};
  const id = 'administrateu@uqo.ca&annotateur@uqo.ca';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence()
      ]
    });
  inject([FirebaseApp, AngularFirestore], (_app: firebase.app.App, _afs: AngularFirestore) => {
    app = _app;
    afs = _afs;
     ann = new AnnotateurService(afs);
     // cette fonction ajoute un annotateur dans la bd
     ann.addAnnotateur(id, annotateurMock);
  })();
  });
  afterEach(async (done) => {
    await app.delete();
    done();
  });
    it('Un annotateur est créer temporairement pour vérifier' +
      ' la fonction addAnnotateur, puis il est détruit', async() => {
      // cette fonction trouve tous les annotateur ayant annotateur@uqo.ca comme courriel
      ann.trouverListeAnnotateur('administrateur@uqo.ca').subscribe( x => {
        let etat = false;
        const item = x[0];
        if ( item['data'].courriel === 'annotateur@uqo.ca') {
          etat = true;
        }
        expect(etat).toBe(true);
        ann.removeAnnotateurs('annotateur@uqo.ca');
      });
    })
});
