import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PacienciaBlackjackComponent } from './paciencia-blackjack/paciencia-blackjack.component';

const routes: Routes = [
  { path: 'paciencia-21', component: PacienciaBlackjackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardGamesRoutingModule { }
