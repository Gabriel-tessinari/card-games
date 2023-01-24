export class Card {
  suit: string;
  value: string;
  points: number[];

  constructor(value: string, suit: string) {
    this.suit = suit;
    this.value = value;
    this.points = [];
  }

  isRed(): boolean {
    return this.suit == '♥' || this.suit == '♦';
  }
}