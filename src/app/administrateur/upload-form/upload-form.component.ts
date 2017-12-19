import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../../shared/upload.service';
import { Upload } from '../../shared/upload';
import * as _ from 'lodash';
import { AnnotateurService, IAnnotateur } from '../../shared/annotateur.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css'],
  providers: [UploadService]
})
export class UploadFormComponent {
  @ Input() courriel: string;
  @ Input() listeNomProjetRepertoire: string;
  @ Input() _listeAnnotateur: Array<IAnnotateur>;
  currentUpload: Upload;
  dropzoneActive = false;
 // texte: BehaviorSubject<string>;
  constructor(private upSvc: UploadService, private an: AnnotateurService) {
  }
  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }
  handleDrop(fileList: FileList) {
    const filesIndex = _.range(fileList.length);
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(fileList[idx]);

      this.upSvc.pushUpload(this.currentUpload, this.courriel, this.listeNomProjetRepertoire)}
    );
    this.updateAnnotaieur();
  }
  updateAnnotaieur() {
    this._listeAnnotateur.forEach( x => {
      let doitEtreUbdated = true;
      x.projets.forEach( y => {
        if ( y === this.listeNomProjetRepertoire) {
          doitEtreUbdated = false;
        }
      })
      if (doitEtreUbdated === true) {
      let temp = [];
      temp = x.projets;
      temp.push(this.listeNomProjetRepertoire);
    // this.an.updateAnnotateur(x);
      }
    });
  }

  previewFile(entries: any) {
    let texte: BehaviorSubject<string>;
    texte = new BehaviorSubject('');
    const input = entries.target;
    const reader = new FileReader();
    reader.onload =  function() {
      texte.next(reader.result);
    };
    texte.subscribe( x => {
    //  this.upSvc.tabPhrase(x);
    });
 //   reader.onloadend = this.printText(texte);
    reader.onloadend = this.printEventType;
    // reader.onloadend.call(this.upSvc.tabPhrase(texte));
    reader.readAsText(input.files[0]);
  //  this.upSvc.tabPhrase(texte);
    // reader.onload = function() {
    //   const text = reader.result;
    //   console.log(reader.result.substring(0, 1000), e);
    // };
    // reader.readAsText(input.files[0]);
    // console.log('allo', reader.readAsText(input.files[0]));
  }

  // parseData(entries) {
  //     reader.onloadend = (function(file) {
  //       return function(evt) {
  //         this.createListItem(evt, file);
  //       };
  //     })(entries);
  //     reader.readAsText(entries);
  //   }
  createListItem(evt, file) {
  }
  printText( text: string) {

  }
  printEventType (event) {
  //  this.texte = event.target.result;
    // console.log('got event: ' + this.texte);
   // this.test();
    // const tab = this.upSvc.tabPhrase('sf');
  }
  test() {
  //  console.log(this.texte);
  }
  onFileChange(event) {
    let texte: BehaviorSubject<string>;
    texte = new BehaviorSubject('');
    let filename: string;
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsText(file);
      reader.onload = () => {
      filename = file.name;
        texte.next(reader.result);
      };
    }
    texte.subscribe( x => {
      this.upSvc.tabPhrase(x, filename, this.courriel);
    });
  }
}
