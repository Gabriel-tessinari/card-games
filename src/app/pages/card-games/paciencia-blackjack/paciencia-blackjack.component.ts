import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../../shared/domains/card';
import { Deck } from '../../shared/domains/deck';
import { Record } from '../../shared/domains/record';

declare var $: any;

@Component({
  standalone: false,
  selector: 'app-paciencia-blackjack',
  templateUrl: './paciencia-blackjack.component.html',
  styleUrls: ['./paciencia-blackjack.component.scss']
})
export class PacienciaBlackjackComponent implements OnInit {
  deck: Deck = new Deck();
  discardPile: Deck = new Deck();
  lines: Line[] = [];
  activeCard: Card = new Card('A', '♥');
  score: number = 0;
  records: Record = new Record();
  oneBlackjack: boolean = false;
  toastMessage: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clean();
  }

  clean() {
    this.setStartLines();
    this.setDeckAndCardPoints();
    this.activeCard = this.deck.pop();
    this.discardPile = new Deck();
    this.score = 0;
    this.oneBlackjack = false;
  }

  setStartLines() {
    this.lines = [];
    for(let i = 0; i < 5; i++) {
      this.lines.push(new Line());
    }
  }

  setDeckAndCardPoints() {
    this.deck = new Deck();
    this.deck.openPack();
    this.deck.shuffle();
    this.deck.setCardsPointsAceOneElevenRoyalAsTen();
  }

  //Playing:
  addCardToLine(line: Line) {
    line.push(this.activeCard);
    line.sumPoints();

    if(hasScored(line)) {
      this.checkScoreRules(line);
    } else {
      this.oneBlackjack = false;
    }

    this.checkSpecialScoreRules();
    this.drawCard();
  }

  discard(line: Line) {
    this.discardPile.cards.push(...line.cards);
    line.clean();
  }

  drawCard() {
    this.activeCard = this.deck.pop();

    if(this.deck.numberOfCards == 0) {
      this.processPoints(100, 'Finalizou o baralho!');
      this.deck.cards.push(...this.discardPile.cards);
      this.deck.shuffle();
      this.discardPile = new Deck();
    }

    this.checkGameOver();
  }

  checkGameOver() {
    if(isAllLinesOver21(this.activeCard, this.lines)) {
      this.openModalGameOver();
    }
  }

  //Score rules:
  checkScoreRules(line: Line) {
    if(isBlackJack(line)) {
      if(this.oneBlackjack) {
        this.processPoints(50, 'Double Blackjack!');
        this.discard(line);
        return;
      }
      
      if(isSuperBlackjack(line.cards)) {
        this.oneBlackjack = true;
        this.processPoints(50, 'Super Blackjack!');
        this.discard(line);
        return;
      }

      this.oneBlackjack = true;
      this.processPoints(21, 'Blackjack!');
      this.discard(line);
      return;
    }

    this.oneBlackjack = false;

    if(line.size == 3 && isSixSevenEight(line.cards)) {
      this.processPoints(15, '6-7-8!');
      this.discard(line);
      return;
    }

    if(line.size == 3 && isSevenSevenSeven(line.cards)) {
      this.processPoints(15, '7-7-7!');
      this.discard(line);
      return;
    }

    if(isLarge21(line)) {
      if(line.size == 5 && isFullHouse(line)) {
        this.processPoints(200, 'Full House!');
        this.discard(line);
        return;
      }

      this.processPoints(15, 'Large 21!');
      this.discard(line);
      return;
    }

    if(line.totalPoints == 21) {
      this.processPoints(10, '21!');
      this.discard(line);
      return;
    }

    if(isUnder21(line)) {
      this.processPoints(5, '5 abaixo de 21!');
      this.discard(line);
      return;
    }
  }

  checkSpecialScoreRules() {
    if(isFiveOfAKind(this.lines)) {
      this.processPoints(100, '5 do mesmo valor!');
      return;
    }

    if(isStraight(this.lines)) {
      this.processPoints(100, 'Maior sequência (16, 17, 18, 19, 20)!');
      return;
    }
  }

  processPoints(value: number, message: string) {
    this.score += value;
    this.toast(message);
  }

  toast(message: string) {
    this.toastMessage = message;
    $("#toast").toast('show');
  }

  openModalGameOver() {
    $("#modal-game-over").show();
  }

  restartGame() {
    if(this.score > this.records.worldRecord) {
      this.records.updateWorldRecord(this.score);
    } else if(this.score > this.records.userRecord) {
      this.records.updatePersonalRecord(this.score);
    }
    this.clean();
    $("#modal-game-over").hide();
  }

  exitGame() {
    //Função que salvará os recordes, no BD, futuramente.
    this.router.navigate(['']);
  }

  openModalRestart() {
    $("#modal-restart").show();
  }

  forcedRestartGame() {
    this.clean();
    this.closeModalRestart();
  }

  closeModalRestart() {
    $("#modal-restart").hide();
  }
}


class Line {
  cards: Card[];
  totalPoints: number;
  totalPoints1: number;
  totalPoints2: number;

  constructor() {
    this.clean();
  }

  clean() {
    this.cards = [];
    this.sumPoints();
  }

  get size() {
    return this.cards.length;
  }

  push(card: Card) {
    this.cards.push(card);
  }

  sumPoints() {
    let values: string[] = [];
    this.totalPoints1 = 0;
    this.totalPoints2 = 0;

    this.cards.forEach(card => {
      this.totalPoints1 += card.points[0];
      values.push(card.value);
    });

    if(values.includes('A') && (this.totalPoints1 + 10) <= 21) {
      this.totalPoints2 = this.totalPoints1 + 10;
    }

    this.totalPoints2 > 0 ? 
    this.totalPoints = this.totalPoints2 :
    this.totalPoints = this.totalPoints1;
  }

  hasCardInPosition(pos: number): boolean {
    return this.cards[pos] != undefined && this.cards[pos] != null;
  }

  hasSamePoints(line: Line): boolean {
    let compareTotalPoints1: boolean = (this.totalPoints1 == line.totalPoints1 ||
    (line.totalPoints2 > 0 && this.totalPoints1 == line.totalPoints2));

    let compareTotalPoints2: boolean = this.totalPoints2 > 0 ?
    (this.totalPoints2 == line.totalPoints1 || this.totalPoints2 == line.totalPoints2) :
    false;

    return (compareTotalPoints1 || compareTotalPoints2);
  }
}


//score rules check functions
function hasScored(line: Line): boolean {
  return !(line.totalPoints < 21 && line.size < 5);
}

function isBlackJack(line: Line): boolean {
  return line.size == 2 && line.totalPoints == 21;
}

function isSuperBlackjack(cards: Card[]): boolean {
  return ((cards[0].suit === '♠' && cards[1].suit === '♠') && 
  ((cards[0].value === 'A' || cards[0].value === 'J') &&
  (cards[1].value === 'A' || cards[1].value === 'J')));
}

function isSixSevenEight(cards: Card[]): boolean {
  let values: string[] = [
    cards[0].value, cards[1].value, cards[2].value
  ];

  return (values.includes('6') && values.includes('7') &&
  values.includes('8'));
}

function isSevenSevenSeven(cards: Card[]): boolean {
  return (cards[0].value === '7' && cards[1].value === '7' && 
  cards[2].value === '7');
}

function isLarge21(line: Line): boolean {
  return (line.size == 4 || line.size == 5) && line.totalPoints == 21;
}

function isUnder21(line: Line): boolean {
  return line.size == 5 && line.totalPoints < 21;
}

function isFiveOfAKind(lines: Line[]): boolean {
  return (lines[0].hasSamePoints(lines[1]) && 
  lines[0].hasSamePoints(lines[2]) && 
  lines[0].hasSamePoints(lines[3]) &&
  lines[0].hasSamePoints(lines[4]));
}

function isStraight(lines: Line[]): boolean {
  let values = [
    lines[0].totalPoints,
    lines[1].totalPoints,
    lines[2].totalPoints,
    lines[3].totalPoints,
    lines[4].totalPoints,
  ];

  return (values.includes(16) && values.includes(17) &&
  values.includes(18) && values.includes(19) && values.includes(20));
}

function isFullHouse(line: Line): boolean {
  let values: string[] = [];
  let quantities: any = {};

  line.cards.forEach(card => {
    values.push(card.value);
  });

  values.forEach(value => {
    quantities[value] = (quantities[value] || 0) + 1;
  });

  return ((Object.values(quantities)[0] == 3 && Object.values(quantities)[1] == 2) ||
  (Object.values(quantities)[0] == 2 && Object.values(quantities)[1] == 3));
}

function isAllLinesOver21(activeCard: Card, lines: Line[]): boolean {
  for(let i = 0; i < lines.length; i++) {
    if(!(activeCard.points[0] + lines[i].totalPoints > 21)) {
      return false;
    }
  }

  return true;
}