import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Project } from './project.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IProject { id: string; data: object; } // interface de la collection Projets.
@Injectable()
export class ProjectService {
  projetCollection: AngularFirestoreCollection<IProject>; // Observable parcourrant la collection.
  projetDoc:  AngularFirestoreDocument<IProject>; // Observable parcourrant un documet d'une colection.
  listProjects: BehaviorSubject<object[]>;
  projectList: Array<object>;
  constructor(private dbc: AngularFirestore) {
    this.listProjects = new BehaviorSubject(null);
  }

  // Cette fonction permet d'ajouter un user dans la collection.
  addProjet( id: string, dataProjet: Project) {
    const data = this.buildObject(dataProjet);
    const item: IProject = { id, data };
    this.projetCollection = this.dbc.collection('projects/');
    this.projetCollection.add(item);
  }

  // Cette fonction permet de modifier les information d'un projet
  updateProject( _id: string, dataProject: Project, path: string) {
    const id = _id;
    const data = this.buildObject(dataProject);
    const item: IProject = { id, data };
    console.log('testttt' , item , path);
    this.projetDoc = this.dbc.doc<IProject>('projects/' + path);
    this.projetDoc.update(item);
  }
  buildObject(dataProjet: Project): object {
    let objTemp: object;
    objTemp = {projectId: dataProjet.projectId, admin: dataProjet.admin,
      annotators: dataProjet.annotators , corpus: dataProjet.corpus};
    return objTemp;
  }
  getProjectTabInfByAdmin(admin: string): Array<object> {
    let oldInfUser: Project;
    let projectTab: Array<object>;
    projectTab = [];
    let tab: Array<object>;

    tab = this.listProjects.getValue();
    tab.forEach( x => {
      oldInfUser = new Project();

      const tempRole = x['data']['data']['admin'];

      if ( tempRole === admin) {
        // x = {data: { data: {firstName: Pascal}}}
        oldInfUser.projectId = x['data']['data']['projectId'];
        oldInfUser.admin = x['data']['data']['admin'];
        oldInfUser.annotators = x['data']['data']['annotators'];
        oldInfUser.corpus = x['data']['data']['corpus'];
        projectTab.push({id: x['data']['id'], data: oldInfUser});
      }
    });
    console.log('list--', projectTab);
    return projectTab;
  }
  getAllProjectTabInf(): Array<object> {
    let oldInfUser: Project;
    let projectTab: Array<object>;
    projectTab = [];
    let tab: Array<object>;

    tab = this.listProjects.getValue();
    tab.forEach( x => {
      oldInfUser = new Project();

      const tempRole = x['data']['data']['admin'];
        // x = {data: { data: {firstName: Pascal}}}
        oldInfUser.projectId = x['data']['data']['projectId'];
        oldInfUser.admin = x['data']['data']['admin'];
        oldInfUser.annotators = x['data']['data']['annotators'];
        oldInfUser.corpus = x['data']['data']['corpus'];
        projectTab.push({id: x['data']['id'], data: oldInfUser});
    });
    console.log('list', projectTab);
    return projectTab;
  }

  getProjetList( email: string ): Array<object> {
    const tabTemp = [];
    const list = this.getAllProjectTabInf();
    list.forEach(x => {
      console.log('qqYail--', x['data']['admin'], email);
      if (x['data']['admin'] === email) {
        tabTemp.push(x);
      } else if (x['data']['annotators'] !== undefined ) {
        x['data']['annotators'].forEach( y => {
          console.log('Yail--', y);
          if (email === y) {
            tabTemp.push(x);
            console.log('email--', x);
          }
        });
      }
    });
    console.log('email', tabTemp);
    return tabTemp;
  }
  createUidAndDataList() {
    this.projectList = [];
    let trouverUid: Observable<any>;
    trouverUid = this.allProjects.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as IProject;
          const id = a.payload.doc.id;
          this.projectList.push({id: id, data: data});
          return {id, ...data};
        });
      });
    trouverUid.subscribe(
      x => {
        this.listProjects.next(this.projectList);
      }
    );
  }
  // Cette fonction permet de retourner tout la collection projects
  get allProjects(): AngularFirestoreCollection<IProject> {
    let tabProject: AngularFirestoreCollection<IProject>;
    this.projetCollection = this.dbc.collection('projects')
    tabProject = this.projetCollection;
    return tabProject;
  }

  getProjectInf(name: string): Project {
    const oldInfProject = new Project();
    let tab: Array<object>;
    tab = this.listProjects.getValue();
    tab.forEach( x => {
      const temp = x['data']['id'];
      if ( temp === name) {
        oldInfProject.projectId = x['data']['data']['projectId'];
        oldInfProject.admin = x['data']['data']['admin'];
        oldInfProject.annotators = x['data']['data']['annotators'];
        oldInfProject.corpus = x['data']['data']['corpus'];
      }
    });

    return oldInfProject;
  }
  getProjectUid(name: string): string {
    let uid: string;
    uid = '';
    let tab: Array<object>;
    tab = this.listProjects.getValue();
    tab.forEach( x => {
      const temp = x['data']['id'];
      if ( temp === name) {
        uid = x['id'];
      }
    });
    return uid;
  }

}
