import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import {ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EditDbService } from './../shared/edit-db.service';
import { ProjectService } from './../shared/project.service';
import { Edit } from './../shared/edit.model';
import { List } from './../shared/list.model';
import { Visu } from './../shared/visu.model';
import { Project } from './../shared/project.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UploadService } from './../shared/upload.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FrameComponent implements OnInit {
  objParentVisu: object;
  user: any;
  objParentEdit: Edit;
  objParentList: List;
  userEmail: string; // Le courriel de l'utilisateur
  show = 'accueil'; // donne le module devant être affiché
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  projectList: Array<object>;
  annotatorList: Array<object>;
  listeNomProjet = [];
  listeNomAnnotator = [];
  listProjetMenue: Array<object>;
  texteSelection = [{nomParent: 'adnotatio'}, {nomTexte: 'fonctions2.txt'}];
  couleurSelection = [];
  role = 0;
  constructor(private upSvc: UploadService, private auth: AuthService, private edit: EditDbService, private _formBuilder: FormBuilder, private pr: ProjectService) {
    auth.user.subscribe(
      (x) => {
        this.user = this.auth.currentUserDisplayName;
        edit.createUidAndDataList();
        pr.createUidAndDataList();


      },
      (err) => console.log('err'),
      () => console.log('fini')
    );
  }

  ngOnInit() {

    this.infoUser();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
  getUserRole(email: string): number {
    const role = this.edit.getUserInf(email)['role'];
    console.log('role' , role);
    return role;
  }

  ajouterUser(role: number) {
    const edit = new Edit();
    edit.role = role;
    edit.action = 'Ajouter';
    edit.entity = 'user';
    edit.click = 'a' + role;
    edit.responsable = this.userEmail;
    this.objParentEdit = edit;
    this.show = 'edit';
  }

  listUsersClick(role: number) {
    const list = new List();
    list.role = role;
    list.userEmail = this.userEmail;
    list.nameOfList = 'user';
    this.objParentList = list;
    this.show = 'list';
  }
  ajouterProjetClick() {
    const edit = new Edit();
    edit.action = 'Ajouter';
    edit.responsable = this.userEmail;
    edit.entity = 'project';
    edit.click = 'p';
    this.objParentEdit = edit;
    this.show = 'edit';
  }
  addTextClick() {
    this.projectList = this.pr.getProjectTabInfByAdmin(this.userEmail);
    this.annotatorList = this.edit.getUserTabInfByRole(1, this.userEmail);
    this.show = 'text';
  }
  listProjetClick() {
    const list = new List();
    list.nameOfList = 'project';
    this.objParentList = list;
    this.show = 'list';

  }
  // Cette fonction va chercher le courriel de l'utilisateur
  infoUser() {
    console.log('x', this.auth);
    this.auth.user.subscribe( x => {
      this.userEmail = x.email;
    });
  }
  objEnfantEdit (e: any) {
    console.log('chantal' , e['action'])
    this.show = e['action'];
  }
  objEnfantList(list: object) {
    const edit = new Edit();
    edit.role = list['role'];
    edit.action = list['action'];
    edit.identForUpdate = list['emailSelect'];
    edit.responsable = this.userEmail;
    edit.click = 'm' + list['role'];
    edit.entity = list['nameOfList'];
    edit.projectName = list['projectName'];
    this.objParentEdit = edit;
    if (list['nameOfList'] === 'accueil') {
      this.show = 'accueil';
    } else {
      this.show = 'edit';
    }
    console.log('edte' , this.objParentEdit);
  }
  logOut() {
    this.auth.logout();
  }
  // get annotatorList(): Array<object> {
  //  const temp = this.edit.getUserTabInfByRole(1, this.userEmail);
  //  return temp;
  // }
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
    console.log('option', this.listeNomProjet, selected);
  }
  selectionAnnotators(selected: any , nomProjet: string) {
    if (selected.selected === true) {
      this.listeNomAnnotator.push(nomProjet);
    } else {
      this.listeNomAnnotator.forEach( x => {
          if ( nomProjet === x ) {
            this.listeNomAnnotator.pop();
          }
        }
      );
    }
    console.log('option', this.listeNomAnnotator, selected);
  }
  onFileChange(event) {
    let texte: BehaviorSubject<string>;
    texte = new BehaviorSubject('');
    let filename: string;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsText(file);
      reader.onload = () => {
        filename = file.name;
        texte.next(reader.result);
        this.associateProjectAndAnnotator(filename);
      };
    }
    texte.subscribe( x => {
      this.upSvc.tabPhrase(x, filename, this.userEmail);
    });
  }

  associateProjectAndAnnotator(filename: string) {
    let isInTheCorpus: boolean;
    let tabcorpus: Array<string>;
    let tabAnnotator: Array<string>;
    tabAnnotator = [];
    tabcorpus = [];
    this.listeNomProjet.forEach( x => {
      isInTheCorpus = false;
      console.log( '****testFile', this.pr.getProjectInf(x), x);
      if (this.pr.getProjectInf(x)['corpus'] !== undefined) {
        tabcorpus = this.pr.getProjectInf(x)['corpus'];
        const listCorpus = this.pr.getProjectInf(x)['corpus'];
        console.log('coollll', listCorpus, filename);
        listCorpus.forEach( y => {
          if (y === filename) {
            isInTheCorpus = true;
          }
        });
      } else {
        console.log('merde');
        tabcorpus = [];
      }
      if (!isInTheCorpus) {
        tabcorpus.push(filename);
        console.log('llll');
      }
        if (this.pr.getProjectInf(x).annotators !== undefined && this.pr.getProjectInf(x).annotators !== []) {
          tabAnnotator = this.pr.getProjectInf(x).annotators;
          this.listeNomAnnotator.forEach( z => {
            let isInTheAnnotator: boolean;
            isInTheAnnotator = false;
            const temp = this.pr.getProjectInf(x).annotators;
            temp.forEach( q => {
              console.log('q', q, ',z', z);
              if (q === z) {
                // si dans le projet il y a un annotateur du meme nom alors true.
                isInTheAnnotator = true;
              }
            });
            console.log('testrue' , !isInTheAnnotator , z, x, this.pr.getProjectInf(x).annotators);
            if (!isInTheAnnotator) {
              tabAnnotator.push(z);
            }
          });
        } else {
          tabAnnotator = this.listeNomAnnotator;
        }
        console.log('---test----', x, tabcorpus, tabAnnotator)
      this.updateProject(x, tabcorpus, tabAnnotator);
    });
  }
  updateProject( projectname: string, newCorpusList: Array<string>, newAnnotatorList: Array<string>) {
    const uid = this.pr.getProjectUid(projectname);
    const project = new Project();
    project.projectId = projectname;
      project.corpus = newCorpusList;
      project.annotators = newAnnotatorList;
      project.admin = this.userEmail;
    console.log('upd', projectname, project, uid);
      this.pr.updateProject(projectname, project, uid);
      this.pr.createUidAndDataList();
  }
  menue() {
    this.role = this.getUserRole(this.userEmail);
    if (this.role === 3) {
     this.listProjetMenue = this.pr.getAllProjectTabInf();
    } else {
      this.listProjetMenue = this.pr.getProjetList(this.userEmail);
    }
  }
  fermerClick() {
    this.show = 'home';
  }
  get listeProjet(): Array<object> {
    const temp = this.pr.getProjetList(this.userEmail);
    return temp;
  }
  corpusClick(corpus: string) {
    console.log('corpus' , corpus);
    const visu = new Visu();
    visu.corpus = corpus;
    visu.role = this.role;
    visu.user = this.userEmail;
    this.objParentVisu = visu;
    this.show = 'visualisation';
  }
  addcatClick() {
    const edit = new Edit();
    edit.action = 'Ajouter';
    edit.responsable = this.userEmail;
    edit.entity = 'categorie';
    edit.responsable = this.userEmail;
    edit.click = 'p';
    this.objParentEdit = edit;
    this.show = 'edit';
  }
}
