import { Card } from "../card";

export class Line {
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