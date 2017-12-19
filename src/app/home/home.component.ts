import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import { AnnotateurService, IAnnotateur } from '../shared/annotateur.service';
import { RoleService , IRole} from '../shared/role.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import * as firebase from 'firebase';
import { Edit } from './../shared/edit.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        transform: 'translateX(0)',
      })),
      state('active', style({
        transform: 'translateX(1000)',
      })),
      transition('inactive => active',  animate('6000s')),
      transition('active => inactive', animate('6000s'))
    ])
  ]
})



export class HomeComponent implements OnInit {
  objParentEdit: Edit;
  state= 'inactive';
  user: any;
  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  editeurObj: Observable<any>;
  editeurObjRef: AngularFireObject<any>;
  editeurList: Observable<any>;
  estUnAnnotateur = false;
  estUnAdministrateurSys = false;
  estUnAdministrateur = false;
  courriel: string;
  tabRole: Array<IRole>;
  uid: string;
  edit = false;
  constructor(private auth: AuthService, db: AngularFireDatabase,
              private http: HttpClient, private an: AnnotateurService, private ro: RoleService) {
    this.itemRef = db.object('/administration');
    this.editeurObjRef = db.object('/edition');
    this.editeurList = db.list('/edition').valueChanges();
    this.item = this.itemRef.valueChanges();
    this.editeurObj = this.editeurObjRef.valueChanges();
    auth.user.subscribe(
      (x) => this.user = this.auth.currentUserDisplayName,
      (err) => console.log('err'),
      () => console.log('fini')
    )
  }
  ngOnInit() {
this.infoUser();

    // const storage = firebase.storage().ref();
    // // const gsReference = storage.refFromURL('gs://projetia-8a0f1.appspot.com/uploads/Leina.docx');
    // // const httpsReference = storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/projetia-8a0f1.appspot.com/o/uploads%2FLeina.docx?alt=media&token=bd6fbcd9-e781-495f-b31b-b4f1f2ec726c');
    // const xhr = new XMLHttpRequest();
    //
    // let test = [];
    // test = storage.child('https://firebasestorage.googleapis.com/v0/b/projetia-8a0f1.appspot.com/o/uploads%2FLeina.docx?alt=media&token=bd6fbcd9-e781-495f-b31b-b4f1f2ec726c').put()

    // this.http.get('https://firebasestorage.googleapis.com/v0/b/projetia-8a0f1.appspot.com/o/uploads%2FLeina.docx?alt=media&token=bd6fbcd9-e781-495f-b31b-b4f1f2ec726c').subscribe(data => {
    //   console.log('dataText', data);
    // });

}
logOut() {

    this.auth.logout();
}
  infoUser() {
    console.log('x', this.auth);
    this.auth.user.subscribe( x => {
      // this.infoRole( x.email );
      this.userRole( x.email );
      console.log('uid', x.uid);
      this.courriel = x.email;
    })
  }
  userRole( courriel: string ) {
    this.tabRole = [];
    this.ro.tabRoles( courriel ).subscribe( x => {
      this.tabRole.push(x[0]);
      let temp = x[0];

      if (temp['data'].annotateur) {
        this.estUnAnnotateur = true;
      }
      if (temp['data'].administrateur) {
        this.estUnAdministrateur = true;
      }
      if (temp['data'].administrateurSys) {
        this.estUnAdministrateurSys = true;
      }
      console.log('temp', this.tabRole);
    })
  }
  ajouterUser(role: number) {
    const edit = new Edit();
    edit.role = role;
    edit.action = 'add';
    edit.responsable = this.courriel;
    this.objParentEdit = edit;
    this.edit = true;
  }


 }
