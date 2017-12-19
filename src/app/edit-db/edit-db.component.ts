import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormControl} from '@angular/forms';
import { EditDbService } from './../shared/edit-db.service';
import { ProjectService } from './../shared/project.service';
import { User } from './../shared/user.model';
import { Edit } from './../shared/edit.model';
import { Project } from './../shared/project.model';
import {Observable} from 'rxjs/Observable';
import { CategorieService } from '../shared/categorie.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-edit-db',
  templateUrl: './edit-db.component.html',
  styleUrls: ['./edit-db.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EditDbComponent implements OnChanges {
  // Cet objet 'objParentEdit' vient du module parent et informe edit-db s'il faut ajouter, modifier ou visualiser.
  // De plus, il spécifie le doccument à chercher.
  @ Input () objParentEdit: Edit;
  @ Output () objEnfantEdit = new EventEmitter<Edit>();
  userForm: FormGroup; // Est la valiable contenant les validations du formulaire.
  role: string; // cette variable est mis dans le titre de la fenêtre HTML. Le role peut être , Lecteur, Annotateur, Administrateur_projet.
  formValue = ['', '', ''];
  show: string;
  corpusChecked = [];
  annotatorChecked = [];
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  listeProjet: Array<string>;
  couleurs = [ {col: 'Rouge', value: '#F44336' }, {col: 'Bleu', value: '#2196F3'},
    { col: 'Vert', value: '#4CAF50'}, {col: 'Jaune', value: '#FFEB3B'} ,
    { col: 'Black', value: '#000000'} , {col: 'Rose', value: '#E91E63'}];
  states: any[] = [];

  constructor(private fb: FormBuilder, private edit: EditDbService, private pr: ProjectService, private cat: CategorieService) {
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .startWith(null)
      .map(state => state ? this.filterStates(state) : this.states.slice());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.objParentEdit['click'] && !changes.objParentList['click'].isFirstChange()) {
      this.clickAction();
    } else {
      this.clickAction();
    }
  }
  clickAction() {
    this.listeProjet = this.listProjet;
    console.log('iii' , this.objParentEdit);
    if (this.objParentEdit['entity'] === 'project') {
      if (this.objParentEdit['action'] === 'Ajouter') {
        this.addProjet();
      } else if (this.objParentEdit['action'] === 'Modification') {
        this.updateProject();
      }
    } else if (this.objParentEdit['entity'] === 'user') {
      if (this.objParentEdit['action'] === 'Modification') {
        this.ubdateUser();
      } else if (this.objParentEdit['action'] === 'Ajouter') {

      }
      this.show = 'user';
    } else if (this.objParentEdit['entity'] === 'categorie') {
      this.show = 'categorie';
    }
    this.createForm();
  }

  addProjet () {
    this.states = this.edit.getUserTabInfByRole(2, this.objParentEdit['responsable']);
    this.show = 'project';
  }

updateProject () {
this.pr.getProjectInf(this.objParentEdit['projectName']);
console.log(this.pr.getProjectInf(this.objParentEdit['projectName']));
  this.formValue[1] = this.objParentEdit['projectName'];
  this.stateCtrl = new FormControl(this.pr.getProjectInf(this.objParentEdit['projectName'])['admin']);
  this.states = this.edit.getUserTabInfByRole(2, this.objParentEdit['responsable']);
  this.show = 'project';
}

// Cette fonction retourne tous les annotateurs relier au projet
get annotalorsProject(): Array<string> {
    const annotatorsTab = this.pr.getProjectInf(this.objParentEdit['projectName'])['annotators'];
    return annotatorsTab;
}

// Cette fonction retourne tous les textes relier au projet
get corpusProject(): Array<string> {
  const corpusTab = this.pr.getProjectInf(this.objParentEdit['projectName'])['corpus'];
  return corpusTab;
}

  annotatorRemove(e: any, i) {
    this.annotatorChecked[i] = e;
    console.log('ici' , this.annotatorChecked);
  }
  corsusRemove(e: any, i) {
    this.corpusChecked[i] = e.selected;
    console.log('la', e.selected, i, this.corpusChecked);
  }
ubdateUser() {
    const user = this.edit.getUserInf(this.objParentEdit.identForUpdate);
      this.formValue[0] = this.objParentEdit.identForUpdate;
      this.formValue[1] = user.firstname;
      this.formValue[2] = user.lastname;

}
  // Cette fonction crée les validations du formulaire.
  createForm() {
    this.userForm = this.fb.group({
      courrielForm: [this.formValue[0], Validators.email],
      prenomForm: [this.formValue[1], Validators.required ],
      nomForm: [this.formValue[2], Validators.required ]
    });
  }

  // Cette fonction récolte les informations suite à l'enregistrement
  enregistrerClick(nom, prenom, courriel) {
    const user = new User();
    user.firstname = prenom;
    user.lastname = nom;
    user.responsable = this.objParentEdit.responsable;
    user.role = this.objParentEdit.role;
    this.edit.createUidAndDataList();
    this.edit.getUserUid('');
    this.edit.addUser(courriel, user);
    const edit = new Edit();
    edit.action = 'accueil';
    this.objEnfantEdit.emit(edit);
  }


  ModifierClick(nom, prenom, courriel) {
    const uid = this.edit.getUserUid(courriel);
    const user = new User();
    user.firstname = prenom;
    user.lastname = nom;
    user.role = this.objParentEdit.role;
    user.responsable = this.objParentEdit.responsable;
    this.edit.updateUser(courriel, user, uid);
    this.edit.createUidAndDataList();
    const edit = new Edit();
    edit.action = 'accueil';
    this.objEnfantEdit.emit(edit);
  }
  ModifierProjetClick(name: string, admin: string) {
    const uid = this.pr.getProjectUid(name);
    const project = new Project();
    project.admin = admin;
    project.projectId = name;
    this.pr.updateProject(name, project, uid);
    this.pr.createUidAndDataList();
    const edit = new Edit();
    edit.action = 'accueil';
    this.objEnfantEdit.emit(edit);
  }

  enregistrerCategorieClick(nameCat: string, color: string, projectName: string){
    console.log('-----' , nameCat,color,projectName);
    const temp = [projectName];
    this.cat.addProjet(nameCat, {admin: this.objParentEdit['responsable'], project: temp, color: color});
    const edit = new Edit();
    edit.action = 'accueil';
    this.objEnfantEdit.emit(edit);
  }
  enregistrerProjetClick(projetcName: string, adminProj: string) {
    const projectTemp = new Project();
    projectTemp.admin = adminProj;
    projectTemp.projectId = projetcName;
    projectTemp.corpus = [];
    projectTemp.annotators = [];
    this.pr.addProjet(projetcName, projectTemp);
    this.pr.createUidAndDataList();
    const edit = new Edit();
    edit.action = 'accueil';
    this.objEnfantEdit.emit(edit);
  }
  // Cette fonction retourne le rôle en string de l'appel du parent
  get roleSelection(): string {
    let titre: string;
    if (this.objParentEdit['entity'] === 'user') {
      switch (this.objParentEdit.role) {
        case 0: titre = 'lecteur'; break;
        case 1: titre = 'annotateur'; break;
        case 2: titre = 'administrateur de projets'; break;
        case 3: titre = 'administrateur système'; break;
      }
    } else if (this.objParentEdit['entity'] === 'project') {
      titre = 'Projet';
    } else if (this.objParentEdit['entity'] === 'categorie') {
      titre = 'Catégorie';
    }
    return titre;
  }
  filterStates(name: string) {
    return this.states.filter(state =>
      state['data'].firstname.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  get listProjet(): Array<string> | null {
    const projectList = [];
    const list = this.pr.getProjectTabInfByAdmin(this.objParentEdit['responsable']);
    list.forEach( x => {
      projectList.push(x['id']);
    });
    return projectList;
  }
  get isDisabled(): boolean {
    let status: boolean;
    if (this.userForm.status === 'VALID') {
      status = false;
    } else {
      status = true;
    }
    return status;
  }

}
