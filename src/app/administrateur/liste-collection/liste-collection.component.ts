// Programmeur Pascal Néron
// Date 2017/11/19
// Ce module créé des listes d’item selon les spécifications du module parent.
// Celle-ci retourne une interface avec des fonctionnalités spécifiques

import {Component, ElementRef, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import { AnnotateurService } from '../../shared/annotateur.service';
import { TexteServiceService } from '../../shared/texte-service.service';
import { UploadService } from '../../shared/upload.service';
import { CategorieService} from '../../shared/categorie.service';
import { Edit } from './../../shared/edit.model';
import { List } from './../../shared/list.model';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';



@Component({
  selector: 'app-liste-collection',
  templateUrl: './liste-collection.component.html',
  styleUrls: ['./liste-collection.component.css'],
  providers: [ AnnotateurService, TexteServiceService ]
})



export class ListeCollectionComponent implements OnChanges  {
  @ Input () objParentList: List;
  @Output() objEnfantList = new EventEmitter <List>();
  @Output() envoieCourriel = new EventEmitter <Array<string>>(); // cette viriable envoie le courriel de la sélection choisie aux parents
  @Output() envoieCatCouleur = new EventEmitter <Array<string>>(); // cette viriable envoie la couleur de la sélection choisie aux parents
  @Input () collectionNom: string; // Cette variable envoyer par le module parent, identifie quelle collection choisir.
  @Input () identAdministrateur: string; // Cette variable identifie l'administrateur
  displayedColumns = ['nom', 'icon']; // colonne de la liste
  exampleDatabase: ExampleDatabase;
  dataSource: ExampleDataSource | null;
  icon = [];
  nom = [];


  selectedValue: string; // la sélection du menu déroulant pour la catégorie
  selectedValueMots: string; // la sélection du menu déroulant pour les mots

  couleurs = [
    {value: '#000000', viewValue: 'Noir'},
    {value: '#F44336', viewValue: 'Rouge'},
    {value: '#2196F3', viewValue: 'Bleu'}
  ];
  @ViewChild('filter') filter: ElementRef;
  constructor(private an: AnnotateurService, private upl: UploadService, private te: TexteServiceService, private ca: CategorieService) {
  }
  // Cette fonction permet d'afficher les éléments après un changement
  ngOnChanges(changes: SimpleChanges) {
    if (changes.collectionNom && !changes.collectionNom.isFirstChange()) {
      this.creationListe();
    } else {
      this.creationListe();
    }
  }

  // Cette fonction crée des liste à partie de la bd
  creationListe() {
    const nom = [];
    const icon = [];
    const prenom = [];
    const projet = [];
    const mot = [];
    const position = [];

    if ( this.collectionNom === 'Annotateurs') {
      this.an.trouverListeAnnotateur(this.identAdministrateur).subscribe( x => {
        // this.courriel.push(x['data'].courriel);
        // this.nom.push(x['data'].prenom);
        const data = [];
        data.push(x);
        data[0].forEach( z => {
          const temp = z.data;
          nom.push(temp.nom);
          icon.push(temp.id);
          prenom.push(temp.prenom);
        });
        this.exampleDatabase = new ExampleDatabase( nom, icon, prenom, this.collectionNom);
        this.dataSource = new ExampleDataSource(this.exampleDatabase);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
      });
    }
    else if ( this.collectionNom === 'Textes') {
      this.upl.trouverListeUpload(this.identAdministrateur).subscribe( x => {
        const data = [];
        data.push(x);
        data[0].forEach( z => {
          const temp = z.data;
          nom.push(temp.nom);
          icon.push(temp.id);
          prenom.push(temp.prenom);
        });
        this.exampleDatabase = new ExampleDatabase( nom, icon, prenom, this.collectionNom);
        this.dataSource = new ExampleDataSource(this.exampleDatabase);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
      });
    } else if (this.collectionNom === 'Catégories') {
      this.ca.trouverListeCategorie(this.identAdministrateur).subscribe( x => {
        console.log('admin' , x);
        const data = [];
        data.push(x);

        data[0].forEach( z => {
          const temp = z.data;
          nom.push(z.id);
          projet.push(temp.projet);
        });
        this.exampleDatabase = new ExampleDatabase( nom, projet, [], this.collectionNom);
        this.dataSource = new ExampleDataSource(this.exampleDatabase);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
      });
    } else if (this.collectionNom === 'mots'){
      this.te.getTExt(this.identAdministrateur).subscribe( x => {
        const data = [];
        data.push(x);
        data[0].forEach( z => {
          const temp = z.data;
          if (temp.mot !== ' ' && temp.mot !== '' && temp.mot !== '.' && temp.mot !== ',') {
            console.log('mottra' , temp.mot, temp.id);
            mot.push(temp.mot);
            position.push(temp.id);
          }
        });
        this.exampleDatabase = new ExampleDatabase( mot, position, [], this.collectionNom);
        this.dataSource = new ExampleDataSource(this.exampleDatabase);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
      });
    }
  }

  // envoie le choix de la couleur choisi au module parent provenent de la liste de catégorie
  choixCouleur(nom: string) {
    console.log('_coul' , this.selectedValue, nom);
    this.envoieCatCouleur.emit([nom, this.selectedValue]); // envoie le nom de la catégorie et la couleur.
  }
  // envoie le choix de la couleur choisi au module parent provenent de la liste de mot
  choixCouleurMots(nom: string) {
    console.log('_coul' , this.selectedValue, nom);
    this.envoieCatCouleur.emit([nom, this.selectedValueMots]); // envoie le nom de la catégorie et la couleur.
  }
  modifierInfUserClick (email: string) {
    const modif = new List();
    modif.role = this.objParentList.role;
    modif.emailSelect = email;
   // this.objEnfantList.emit([nom, this.selectedValue]);
  }
}



// Cette partie de code à été pris au site Angular Matérial https://material.angular.io/components/table/examples
export interface UserData {
  nom: string;
  icon: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }
  nom: Array<string>;
  icon: Array<string>;
  prenom: Array<string>;
  projet: Array<string>;
  collection: string;
  constructor( _nom: Array<string>, _icon: Array<string>, _prenom: Array<string>, _collection: string) {
    this.nom = _nom;
    this.icon = _icon;
    this.prenom = _prenom;
    this.collection = _collection;
    this.projet = _icon;
    // Fill up the database with 30 users.
    console.log(' cat_num' , this.nom );
    for (let i = 0; i < this.nom.length; i++) { this.addUser(i); }
  }

  /** Adds a new user to the database. */
  addUser(a: number) {
    const copiedData = this.data.slice();
    if (this.collection === 'Annotateurs') {
      copiedData.push( this.createNewUser(a) );
    } else if (this.collection === 'Textes') {
      copiedData.push( this.createNewTextes(a) );
    } else if ( this.collection === 'Catégories' ) {
      copiedData.push( this.createNewCategorie(a));
    } else if ( this.collection === 'mots' ) {
      copiedData.push( this.createNewMot(a));
    }

    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser(a: number) {
    return {
      nom: this.nom[a] + ', ' + this.prenom[a],
      icon: this.icon[a],
    };
  }
  private createNewTextes(a: number) {
    return {
      nom: this.nom[a],
      icon: this.icon[a],
    };
  }
  private createNewCategorie(a: number) {
    return {
      nom: this.nom[a],
      icon: this.projet[a],
    };
  }
  private createNewMot(a: number) {
    return {
      nom: this.nom[a],
      icon: this.projet[a],
    };
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {

      return this._exampleDatabase.data.slice().filter((item: UserData) => {
        let searchStr = (item.nom ).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
    });
  }
  disconnect() {}
}
