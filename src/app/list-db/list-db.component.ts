import {Component, ElementRef, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { EditDbService } from './../shared/edit-db.service';
import {Observable} from 'rxjs/Observable';
import { ProjectService} from '../shared/project.service';
import { CategorieService } from '../shared/categorie.service';
import { AnnotateurService } from './../shared/annotateur.service';
import { TexteServiceService } from './../shared/texte-service.service';
import { UploadService } from './../shared/upload.service';

import { Edit } from './../shared/edit.model';
import { List } from './../shared/list.model';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-list-db',
  templateUrl: './list-db.component.html',
  styleUrls: ['./list-db.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListDbComponent implements OnChanges {
  @ Input() objParentList: List;
  @ Output() objEnfantList = new EventEmitter<List>();

  displayedColumns = ['userName', 'progress'];
  exampleDatabase: ExampleDatabase;
  dataSource: ExampleDataSource | null;
  titre: string;
  checked = false;
  indeterminate = false;
  align = 'start';
  disabled = false;
  @ViewChild('filter') filter: ElementRef;

  constructor(private edit: EditDbService, private pr: ProjectService, private cat: CategorieService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.objParentList['role'] && !changes.objParentList['role'].isFirstChange()) {
      this.creatList();
    } else {
      this.creatList();
    }
  }

  // Cette fonction retourne un tableau des informations des utilisateurs ayant le role et le responsable.
  get UsersTable(): Array<object> {
    const tabTemp = this.edit.getUserTabInfByRole(this.objParentList['role'], this.objParentList['userEmail']);
    return tabTemp;
  }

  creatList() {

      const lastname = [];
      const firstname = [];
      const email = [];
    if (this.objParentList['nameOfList'] === 'user') {
      this.titre = this.roleSelection;
      this.UsersTable.forEach(x => {
        email.push(x['id']);
        lastname.push(x['data']['lastname']);
        firstname.push(x['data']['firstname']);
      });
      this.exampleDatabase = new ExampleDatabase(lastname, firstname, email);
      this.dataSource = new ExampleDataSource(this.exampleDatabase);
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
    }
    else if ( this.objParentList['nameOfList'] === 'project' ) {
      this.titre = 'Liste de Projets'
    this.pr.getAllProjectTabInf()
      .forEach(x => {
        email.push(x['data']['projectId']);
        lastname.push('project');
        firstname.push(x['data']['projectId']);
      });
      this.exampleDatabase = new ExampleDatabase(lastname, firstname, email);
      this.dataSource = new ExampleDataSource(this.exampleDatabase);
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
    } else if ( this.objParentList['nameOfList'] === 'categorie' ) {
      this.cat.trouverListeCategorie(this.objParentList.userEmail).subscribe( x => {
        x.forEach( y => {
          firstname.push(y.id);
          email.push(y.data['color']);
          lastname.push('project');
        });
        console.log('listecat', x['data']);
        this.exampleDatabase = new ExampleDatabase(lastname, firstname, email);
        this.dataSource = new ExampleDataSource(this.exampleDatabase);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) {
              return;
            }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
      });
    }
  }

  visualisationClick(color: string, cat: string) {
    const list = new List();
    list.color = color;
    list.cat = cat;
    list.action = 'changeColor';
    this.objEnfantList.emit(list);
  }

  updateDataClick(id: string) {
    console.log('first' , this.objParentList['nameOfList']);
    const list = new List();
    if (this.objParentList['nameOfList'] === 'user') {
      list.userEmail = this.objParentList['userEmail'];
      list.emailSelect = id;
      list.role = this.objParentList['role'];
      list.nameOfList = 'user';
      console.log('listee', list);
    } else if (this.objParentList['nameOfList'] === 'project') {
      list.nameOfList = 'project';
      list.projectName = id;
    }
    list.action = 'Modification';
    this.objEnfantList.emit(list);
  }

  removeClick(email: string, firstname: string, lastname: string) {
    const uid = this.edit.getUserUid(email);
    this.edit.deleteUser(uid);
    const list = new List();
    list.nameOfList = 'accueil';
    this.objEnfantList.emit(list);
  }
  get roleSelection(): string {
    let titre: string;
      switch (this.objParentList['role']) {
        case 0: titre = 'Liste de lecteurs'; break;
        case 1: titre = 'Liste d\'annotateur'; break;
        case 2: titre = 'Liste d\'administrateur de projets'; break;
      }
    return titre;
  }

  /** Constants used to fill up our data base. */
}

export interface UserData {
  name: string;
  email: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor(private lastname: Array<any>, private firstname: Array<any>, private email: Array<any>) {
    // Fill up the database with 100 users.
    const lengh = firstname.length;
    for (let i = 0; i < lengh; i++) { this.addUser(i); }
  }

  /** Adds a new user to the database. */
  addUser(a: number) {
    const copiedData = this.data.slice();
    if ( this.lastname[a] === 'project') {
      copiedData.push(this.createNewProjet(a));
    } else {
      copiedData.push(this.createNewUser(a));
    }
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser(a: number) {
    return {
      name: this.firstname[a] + ' ' + this.lastname[a],
      email: this.email[a],
    };
  }
  private createNewProjet(a: number) {
    console.log('projet___' , this.firstname[a]);
    return {
      name: this.firstname[a],
      email: this.email[a],
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
        let searchStr = (item.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}
