import { Card } from "./card";

const SUITS = ['♠', '♣', '♥', '♦'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export class Deck {
  cards: Card[];

  constructor() {
    this.cards = [];
  }

  get numberOfCards() {
    return this.cards.length;
  }

  pop() {
    return this.cards.shift();
  }

  push(card: Card) {
    this.cards.push(card);
  }

  openPack() {
    this.cards = constructCards();
  }

  shuffle() {
    for(let i = this.numberOfCards - 1; i > 0; i--) {
      let newIndex = Math.floor(Math.random() * (i + 1));
      let oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }

  //cards points
  setCardsPointsAceOneElevenRoyalAsTen() {
    this.cards.forEach(card => {
      if(card.value === '10' || card.value === 'J' || 
      card.value === 'Q' || card.value === 'K') {
        card.points[0] = 10;
      } else if(card.value === 'A') {
        card.points = [1, 11];
      } else {
        card.points[0] = parseInt(card.value);
      }
    });
  }
}

function constructCards(): Card[] {
  let cards = [];

  SUITS.forEach(suit => {
    VALUES.forEach(value => {
      cards.push(new Card(value, suit));
    });
  });

  return cards;
}