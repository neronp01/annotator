import { Component, OnInit , Input, Output,  EventEmitter} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Upload} from '../../shared/upload';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fichier',
  templateUrl: './fichier.component.html',
  styleUrls: ['./fichier.component.css']
})
export class FichierComponent implements OnInit {
@ Input () file: object;

name: string;
date: Date;
size: number;
projets: string;

  constructor() { }

  ngOnInit() {
    const t = this.file['data'];
    this.name = t.name;
    this.size = t.size / 10000;
    this.date = t.createdAt;
    this.projets = t.projet;
  }

}
