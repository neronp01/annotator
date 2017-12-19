import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { TexteServiceService, IMot } from '../../shared/texte-service.service';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {Subscription} from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';




@Component({
  selector: 'app-svg-text',
  templateUrl: './svg-text.component.html',
  styleUrls: ['./svg-text.component.css'],
  animations: [
    trigger('text_move', [
      state('text0start', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text0end', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text1start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text1end', style({
        transform: 'translateY(0px) translateX(-0px)',
      })),
      state('text2start', style({
        transform: 'translateY(0px) translateX(-0px)',
      })),
      state('text2end', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text4start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text4end', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text5start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text5end', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text7start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text7end', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text9start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text9end', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text9start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text9end', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text10start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text10end', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text10start', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text12start', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text12end', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text13start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text13end', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      state('text15start', style({
        transform: 'translateY(0px) translateX(-500px)',
      })),
      state('text15end', style({
        transform: 'translateY(0px) translateX(0px)',
      })),
      transition('text0start => text0end', animate('50000ms ease-in')),
      transition('text1start => text1end', animate('50000ms ease-in')),
      transition('text2start => text2end', animate('50000ms ease-in')),
      transition('text4start => text4end', animate('50000ms ease-in')),
      transition('text5start => text5end', animate('50000ms ease-in')),
      transition('text7start => text7end', animate('50000ms ease-in')),
      transition('text9start => text9end', animate('50000ms ease-in')),
      transition('text10start => text10end', animate('50000ms ease-in')),
      transition('text12start => text12end', animate('50000ms ease-in')),
      transition('text13start => text13end', animate('50000ms ease-in')),
      transition('text15start => text15end', animate('50000ms ease-in')),

    ])
  ],
  providers: [ TexteServiceService ]
})
export class SvgTextComponent implements OnChanges {
state = ['text2start', 'text13start', 'text10start', 'text5start'];
textVisua = 'Les grandes personnes m’ont conseillé de laisser de côté les dessins de serpents boas ouverts ou fermés, et de m’intéresser plutôt à la géographie, à l’histoire, au calcul et à la grammaire. C’est ainsi que j’ai abandonné, à l’âge de six ans, une magnifique carrière de peintre. J’avais été découragé par l’insuccès de mon dessin numéro 1 et de mon dessin numéro 2. Les grandes personnes ne comprennent jamais rien toutes seules, et c’est fatigant, pour les enfants, de toujours et toujours leur donner des explications. J’ai donc dû choisir un autre métier et j’ai appris à piloter des avions. J’ai volé un peu partout dans le monde. Et la géographie, c’est exact, m’a beaucoup servi. Je savais reconnaître, du premier coup d’œil, la Chine de l’Arizona. C’est très utile, si l’on est égaré pendant la nuit. J’ai ainsi eu, au cours de ma vie, des tas de contacts avec des tas de gens sérieux. J’ai beaucoup vécu chez les grandes personnes. Je les ai vues de très près. Ça n’a pas trop amélioré mon opinion. Quand j’en rencontrais une qui me paraissait un peu lucide, je faisais l’expérience sur elle de mon dessin numéro 1 que j’ai toujours conservé. Je voulais savoir si elle était vraiment compréhensive. Mais toujours elle me répondait : « C’est un chapeau. » Alors je ne lui parlais ni de serpents boas, ni de forêts vierges, ni d’étoiles. Je me mettais à sa portée. Je lui parlais de bridge, de golf, de politique et de cravates. Et la grande personne était bien contente de connaître un homme aussi raisonnable.J’ai ainsi vécu seul, sans personne avec qui parler véritablement, jusqu’à une panne dans le désert du Sahara, il y a six ans. Quelque chose s’était cassé dans mon moteur. Et comme je n’avais avec moi ni mécanicien, ni passagers, je me préparai à essayer de réussir, tout seul, une réparation difficile. C’était pour moi une question de vie ou de mort. J’avais à peine de l’eau à boire pour huit jours. Le premier soir je me suis donc endormi sur le sable à mille milles de toute terre habitée. J’étais bien plus isolé qu’un naufragé sur un radeau au milieu de l’Océan. Alors vous imaginez ma surprise, au lever du jour, quand une drôle de petite voix m’a réveillé. J’ai sauté sur mes pieds comme si j’avais été frappé par la foudre. J’ai bien frotté mes yeux. J’ai bien regardé. Et j’ai vu un petit bonhomme tout à fait extraordinaire qui me considérait gravement. Voilà le meilleur portrait que, plus tard, j’ai réussi à faire de lui. Mais mon dessin, bien sûr, est beaucoup moins ravissant que le modèle. Ce n’est pas ma faute. J’avais été découragé dans ma carrière de peintre par les grandes personnes, à l’âge de six ans, et je n’avais rien appris à dessiner, sauf les boas fermés et les boas ouverts. Quand le mystère est trop impressionnant, on n’ose pas dé- sobéir. Aussi absurde que cela me semblât à mille milles de tous les endroits habités et en danger de mort, je sortis de ma poche une feuille de papier et un stylographe. Mais je me rappelai alors que j’avais surtout étudié la géographie, l’histoire, le calcul et la grammaire et je dis au petit bonhomme (avec un peu de mauvaise humeur) que je ne savais pas dessiner. Quand le mystère est trop impressionnant, on n’ose pas dé- sobéir. Aussi absurde que cela me semblât à mille milles de tous les endroits habités et en danger de mort, je sortis de ma poche une feuille de papier et un stylographe. Mais je me rappelai alors que j’avais surtout étudié la géographie, l’histoire, le calcul et la grammaire et je dis au petit bonhomme (avec un peu de mauvaise humeur) que je ne savais pas dessiner. Il me fallut longtemps pour comprendre d’où il venait. Le petit prince, qui me posait beaucoup de questions, ne semblait jamais entendre les miennes. Ce sont des mots prononcés par hasard qui, peu à peu, m’ont tout révélé. Ainsi, quand il aperçut pour la première fois mon avion (je ne dessinerai pas mon avion, c’est un dessin beaucoup trop compliqué pour moi).';
textTab = [];
lettreTab = [];
tabMots = [];
test5 = '';

  _selectionTexte: BehaviorSubject<Array<object>>;
  _couleurSelection: BehaviorSubject<Array<object>>;
  private data: any;
  private allTime: any;
  private subscription: Subscription;
  @ Input () texteSelection: Array<object>;
  @ Input () couleurSelection: Array<string>;
  @ Input () parent: string;
  @ Input () refresh: string;
  @ Output() texte = new EventEmitter <string>();
  @ Output() categories = new EventEmitter <Array<string>>();
  @ Output() motClick = new EventEmitter <Array<string>>();

  constructor(private te: TexteServiceService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refresh && !changes.refresh.isFirstChange()) {
      this.initFunction();

    } else {
      this.initFunction();

    }
  }

  initFunction(){
    console.log('couleur section' , this.couleurSelection)
    this._selectionTexte = new BehaviorSubject(this.texteSelection);
    this._selectionTexte.subscribe( x => {
      console.log('x' , x);
      const temp = x[1];
      this.test(temp['nomTexte']);
    });
    this.maperString();
    this.maperLettre();
    let timer = TimerObservable.create(2000, 1000);
    this.subscription = timer.subscribe(t => {
      if ( t === 0){
        this.changementEtat('end');
        this.state = ['text2end' , 'text13end', 'text10end', 'text5end']
      }  else if (t % 49 === 0) {
        this.changementEtat('end');
        this.state = ['text2end' , 'text13end', 'text10end', 'text5end']
      } else if (t % 48 === 0) {
        this.changementEtat('start');
        this.state = ['text2start', 'text13start', 'text10start', 'text5start']
      }
    });
  }
  // Cette fonction permet de mettre une position x et y
  maperString() {
    let lineTemp = ''
    let Yposition = 0;
    let count = 0;
    for (let lettre of this.textVisua) {
      lineTemp += lettre;
      if (lineTemp.length > 100 && lettre === '.') {
        Yposition += 30;
        this.textTab.push({'text': lineTemp, 'position': Yposition, 'animation': 'text' + count++ + 'start'});
        lineTemp = '';
      }
    }

  }
  // Cette fonction permet de changer les états pour l'animation
  changementEtat(etat: string) {
    let count = 0;
    this.textTab.forEach(value => value.animation = 'text' + count ++ + etat );
  }
  // Cette fonction construit un tableau de phrase
  maperLettre() {
    let count = 0;
    let Xposition = 0;
    this.textTab.forEach(value => {
      let stringSize = value.text.length;
      for (let lettre of value.text) {
        this.lettreTab.push({'caract': lettre, 'position': Xposition, 'etat': 'stand'});
        Xposition += 10;
      }
    });
  }
  // Cette fonction donne la liste des catégories pour chaque mots ou sa sourie passe aux modules parent
  mouseOverCategorie(e: any, d: any, cat: any) {
    const temp = [];
    console.log(e, d);
    this.texte.emit(d);
    if (cat !== undefined) {
      this.categories.emit(cat);
    } else {
      this.categories.emit([]);
    }
    this.test5 = d;
  }
  // quand la sourie click sur un mot alors il envois le mot ainsi que son id au module parent parent
  texteClik(mot: any, id: number) {
    this.motClick .emit([mot, id]);
  }
  test(nomTexte: any) {
    this.tabMots = [];
    console.log('nom text', nomTexte)
      this.te.getTExt(nomTexte).subscribe(x => {
          x.forEach(y => {
            const mot = y.data;
            this.tabMots.push(mot);
          });
        }
      );
  }
}
