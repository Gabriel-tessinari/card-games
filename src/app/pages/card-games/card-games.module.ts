import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardGamesRoutingModule } from './card-games-routing.module';
import { PacienciaBlackjackComponent } from './paciencia-blackjack/paciencia-blackjack.component';
import { RulesModalModule } from '../shared/components/rules-modal/rules-modal.module';

@NgModule({
  declarations: [PacienciaBlackjackComponent],
  imports: [
    CommonModule,
    CardGamesRoutingModule,
    RulesModalModule
  ]
})
export class CardGamesModule { }