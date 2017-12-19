import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import {Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AnnotateurService, IAnnotateur } from '../shared/annotateur.service';
import { ProjetService, IProjet } from '../shared/projet.service';
import { FormGroup,  FormBuilder,  Validators} from '@angular/forms';
import { RoleService , IRole} from '../shared/role.service';


import { UploadService, Item } from './../shared/upload.service';
import {Upload} from '../shared/upload';

@Component({
  selector: 'app-administrateur',
  templateUrl: './administrateur.component.html',
  styleUrls: ['./administrateur.component.css'],
  providers: [UploadService]
})
export class AdministrateurComponent implements OnInit {
  @ Input() editeurList: Observable<Array<any>>;
  @ Input() courriel: string;
  @ Input() tabRole: Array<IRole>;
  uid: string;
  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  annotateurs: BehaviorSubject<IAnnotateur[]>;
  projets: BehaviorSubject<IProjet[]>;
  files: BehaviorSubject<Item[]>;
  annotateurForm: FormGroup;
  listeNomProjet: Array<string>;
  _listeAnnotateur: Array<IAnnotateur>;
  listeNomProjetRepertoire: string;
  vue: string;
  ischecked= false;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  _listeRole = [];
  collectionNom = 'Annotateurs';
// 'Textes'
// 'Annotateurs'
  @ViewChild('collection') collection: ElementRef;
  constructor(private ro: RoleService, private fb: FormBuilder, db: AngularFireDatabase, private http: Http,
              private up: UploadService,  private an: AnnotateurService, private pr: ProjetService) {
    this.itemRef = db.object('/edition');
    this.item = this.itemRef.valueChanges();
  }
  deleteItem(key: string) {

  }

  ngOnInit() {
this.trouverUid();
    this.listeRole();
    this.vue = 'home';
    // addAnnotateur
    // addText
    this.createForm();
    this.trouverListeAnnotateur(this.courriel);
    this.trouverListeProjet(this.courriel);
    this.creationListeUpload();
    this.listeNomProjet = [];
    this._listeAnnotateur = [];

    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });
  }
  trouverListeAnnotateur(courriel: string) {
    this.an.trouverListeAnnotateur(courriel).subscribe( x => {
      this.annotateurs = new BehaviorSubject(x);
      this.annotateurs.subscribe( y => {

        }
      );
      }
    );
  }
  trouverListeProjet(courriel: string) {
    this.pr.trouverListeProjet(courriel).subscribe( x => {
        this.projets = new BehaviorSubject(x);

        this.projets.subscribe( y => {

          }
        );
      }
    );
  }

  creationListeUpload() {
    this.up.infoUpload.subscribe(
      x => {
        this.files = new BehaviorSubject(x);

      }
    );
  }
  createForm() {
    this.annotateurForm = this.fb.group({
      courrielForm: ['', Validators.email],
      prenomForm: ['', Validators.required ],
      nomForm: ['', Validators.required ]
    });
  }
  get isDisabled(): boolean {
    let status: boolean;
    if (this.annotateurForm.status === 'VALID') {
      status = false;
    } else {
      status = true;
    }
    return status;
  }


  selectionProjets(selected: any , nomProjet: string) {
    if (selected.selected === true) {
      this.listeNomProjet.push(nomProjet);
    } else {
      this.listeNomProjet.forEach( x => {
        if ( nomProjet === x ) {
          this.listeNomProjet.pop();
        }
        }
      );
    }
  }
  selectionProjetsRepertoire(selected: any , nomProjet: string) {
    if (selected.selected === true) {
      this.listeNomProjetRepertoire = nomProjet;
    } else {
      this.listeNomProjetRepertoire = '';
    }

  }

  selectionAnnotateurProjet(selected: any , annotateur: IAnnotateur) {
    if (selected.selected === true) {
      this._listeAnnotateur.push(annotateur);
    } else {
      this._listeAnnotateur.map( x => {
          if ( annotateur === x ) {
            this._listeAnnotateur.pop();
          }
        }
      );
    }
  }
  listeAnnotateursClick() {
    this.collectionNom = 'Annotateurs';
  }
  listeTextesClick() {
    this.collectionNom = 'Textes';
  }
  addAnnotateurClick() {
    this.vue = 'addAnnotateur';
  }
 addTextesClick() {
   this.vue = 'addText';
 }
  enregistrerAnnotateurClick(nom: string, prenom: string, courriel: string ) {
    let temp: any;
   let aUnRole = false;
    this._listeRole.forEach( x => {
      if (x['data'] !== undefined) {
        const data = x['data'].data;
        const _courriel = x['data'].id;
        const uid = x['id'];
        if (_courriel === courriel) {
          data['annotateur'] = true;
          aUnRole = true;
          this.ro.updateRole(_courriel, data, uid);
        }
      }
    });
  if (!aUnRole) {
      this.ro.addRoleAnnotateur(courriel, {id: courriel, administrateurSys: false, annotateur: true, administrateur: false});
    }
    const sizeListRole = this._listeRole.length - 1;
    this._listeRole[sizeListRole].forEach( x => {
      if (x['id'] === courriel) {
        temp = x['data'];
      }
    });
    if ( temp === undefined ) {
      this.tabRole['annotateur'] = true;
      this.tabRole['id'] = courriel;
    //  this.ro.addRoleAnnotateur(courriel, this.tabRole);
    } else {
   //   this.trouverUid(courriel);
    }
    let annotateur: IAnnotateur;
    const id = this.courriel + '&' + courriel;
    annotateur = {id: id, nom: nom, prenom: prenom, courriel: courriel, projets: this.listeNomProjet, administrateur: this.courriel};

    this.an.addAnnotateur(id, annotateur);
    this.vue = 'home';
    this.createForm();
  }
  listeRole() {
    let temp: Observable<any>;
    temp = this.ro._tabRoles;
    temp.subscribe(x => {
      this._listeRole.push(x);
    });
  }
  trouverUid() {
    let trouverUid: Observable<any>;
    trouverUid = this.ro.trouverUid.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IRole;
          const id = a.payload.doc.id;
          this.uid = id;
          this._listeRole.push({id: id, data: data});
        //  this.createForm(data);
          return {id, ...data};
        });
      });
    trouverUid.subscribe(
      x => console.log('subscrib', x )
    );
  }
  fermerClick() {
    this.vue = 'home';
  }
}
