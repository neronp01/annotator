import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ReadFileService } from '../shared/read-file.service';


@Component({
  selector: 'app-apercu',
  templateUrl: './apercu.component.html',
  styleUrls: ['./apercu.component.css'],
  providers: [ReadFileService],
  animations: [
    trigger('text_move', [
      state('text1_start', style({
        transform: 'translateY(-225px) translateX(0px)',
      })),
      state('text1_end',   style({
        transform: 'translateY(-225px) translateX(-500px)',
      })),
      transition('text1_end => text1_start', animate('10000ms ease-in')),
      transition('text1_start => text1_end', animate('10000ms ease-out'))
    ])
  ]
})
export class ApercuComponent implements OnInit {
state= 'text1_start';
parent = 'index';
texteSelection = [{nomParent: 'adnotatio'}, {nomTexte: 'fonctions2.txt'}];
  constructor(private read: ReadFileService) { }

  ngOnInit() {
  }
  test() {
    this.read.test('allo');

  }
}
