import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardGamesRoutingModule } from './card-games-routing.module';
import { PacienciaBlackjackComponent } from './paciencia-blackjack/paciencia-blackjack.component';

@NgModule({
  declarations: [PacienciaBlackjackComponent],
  imports: [
    CommonModule,
    CardGamesRoutingModule
  ]
})
export class CardGamesModule { }