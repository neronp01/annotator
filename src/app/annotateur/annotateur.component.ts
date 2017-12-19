import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TexteServiceService, IMot} from '../shared/texte-service.service';
import { Observable } from 'rxjs/Observable';
import { ProjectService} from '../shared/project.service';
import { CategorieService } from '../shared/categorie.service';
import { Visu } from '../shared/visu.model';
import { List } from '../shared/list.model';

@Component({
  selector: 'app-annotateur',
  templateUrl: './annotateur.component.html',
  styleUrls: ['./annotateur.component.css'],
  providers: [ TexteServiceService ]
})
export class AnnotateurComponent implements OnInit {
  @ Input () objParentVisu: Visu;
  @ Output() objEnfantVisu = new EventEmitter<Visu>();
  texteSelection: [{nomParent: 'adnotatio'}, {nomTexte: ''}];
  objParentList: List;
  textSelect = 'fonctions2.txt';
  couleurSelection = [];
  refresh: string;
  step = 0;
  texteHTML: string;
  motClikHTML: string;
  categorieAnn: Array<string>;
  parent = 'annotateur';
  color = 'accent';
  categorie: string;
  checked = false;
  disabled = false;
  slider= 'Catégories';
  etat = 'categorie';
  collectionNom = 'Catégories';
  courriel = 'neronpascal001@gmail.com';
  motUid: string;
  emplacementMot: number;
  motUpdate= [];
  listTextCorpus: Array<string>;
  listeCat = [];
  projectSelected: string;
  couleurs = [ {col: 'Rouge', value: '#F44336' }, {col: 'Bleu', value: '#2196F3'},
    { col: 'Vert', value: '#4CAF50'}, {col: 'Jaune', value: '#FFEB3B'} ,
    { col: 'Black', value: '#000000'} , {col: 'Rose', value: '#E91E63'}];
  motUpdateCat: IMot;
  selectedValueMots: string;
  show = false;
  constructor(private te: TexteServiceService, private pr: ProjectService, private cat: CategorieService) { }

  ngOnInit() {
    console.log('ob  role' , this.objParentVisu['role']);
    this.findText();
    const list = new List();
    list.projectName = this.objParentVisu.corpus;
    list.nameOfList = 'categorie';
    list.userEmail = this.objParentVisu.user;
    this.objParentList = list;
    this.listeCat = []
    this.listeCategorie();
  }
  findText () {
    this.listTextCorpus = this.pr.getProjectInf(this.objParentVisu.corpus).corpus;

  }
  categorieCoul(e: any) {
     this.couleurSelection.push({idCat: e[0], couleur: e[1]});
     if (this.etat === 'categorie') {
       this.changeCouleur( e[0], e[1]);
     } else {
       this.changeCouleurMot( e[0], e[1]);
     }
  }
  listeCategorie() {
    this.cat.trouverListeCategorie(this.objParentList.userEmail).subscribe( x => {
      x.forEach( y => {
        this.listeCat.push({id: y['id'], color: y['data'].color});
      });
    });
  }
  checkedClick(e: any) {
    if (e.checked === false ) {
      this.slider = 'Catégories';
      this.etat = 'categorie';
      this.collectionNom = 'Catégories';
    } else {
      this.slider = 'Mots';
      this.etat = 'mot';
      this.collectionNom = 'mots';
    }
  }

  initCouleur() {
    let count: number;
    count = 0;
    this.te.getTExt(this.projectSelected).subscribe( x => {
      x.forEach( y => {
        if (y['data'].categorie !== undefined) {
          let temp: boolean;
          temp = false;
          this.listeCat.forEach( z => {
            if (z['id'] === y['data'].categorie) {
              temp = true;
              this.couleurSelection[count] = z['color'];
              count++;
            }
          });
          if (temp === false) {
            this.couleurSelection[count] = '#7e57c2';
            count++;
          }
          console.log(y['data'].categorie);

        }
        this.couleurSelection[count] = '#7e57c2';
        count++;
      });
    });
    console.log(this.couleurSelection);
  }
  changeCouleurMot(idMot: number, couleur: string) {
    let count: number;
    count = 0;
    this.te.getTExt(this.projectSelected).subscribe( x => {
      x.forEach( y => {
        if (idMot === count) {
          this.couleurSelection[count] = couleur;
        }
        count++;
      });
    });
  }
changeCouleur(idCat: string, couleur: string) {
  let count: number;
  count = 0;
    this.te.getTExt(this.projectSelected).subscribe( x => {
      x.forEach( y => {
        const temp = y['data'];
        if (temp['categorie'] !== undefined) {
          temp['categorie'].forEach( z => {
            if (z === idCat) {
              console.log('cat' , idCat, count, couleur);
              this.couleurSelection[count] = couleur;
            }
          });
        }
        count++;
      });
      });
}
texte( e: any) {
    this.texteHTML = e;
}
  motClick(e: any) {
    console.log('eeeee' , e)
    this.motClikHTML = e[0];
this.emplacementMot = e[1];
    this.te.readWordCategory(e[1]).subscribe( x => {
      this.motUpdateCat = x[0];
    });
  }
  choixMots() {

    const temp = this.motUpdateCat;
    const temp2 = temp['data'];
    this.trouverUid(this.emplacementMot);
    if ( temp2.categorie !== undefined ) {
    }
  }

  trouverUid(e: number) {
    let trouverUid: Observable<any>;
    trouverUid = this.te.trouverUid.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IMot;
          const id = a.payload.doc.id;
          this.motUid = id;
          if ( e === data['data'].id) {
            const temp = [];
            temp.push(this.selectedValueMots);
            this.te.updateMot(data, id, temp);

          }
          this.motUpdate.push({id: id, data: data});
          //  this.createForm(data);
          return {id, ...data};
        });
      });
    trouverUid.subscribe(
      x => console.log('subscrib', x )
    );
  }
categories( e: any) {
      this.categorieAnn = e;
}
  showTextClick(e: any) {
    this.refresh = 'newText';
    console.log('e' , e);
    this.show = true;
    this.projectSelected = e;
    this.initCouleur();
  this.texteSelection = [{nomParent: 'adnotatio'}, {nomTexte: e}];
  }
  objEnfantList(e: List) {
    this.color = e.color;
    this.categorie = e.cat;
    this.changeCouleur(e.cat , e.color);
    this.refresh = 'color';
  }
}
