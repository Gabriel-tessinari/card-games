import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuModule) },
  { path: 'games', loadChildren: () => import('./pages/card-games/card-games.module').then(m => m.CardGamesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }