import { CommonModule } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RulesModalComponent } from "./rules-modal.component";

@NgModule({
  declarations: [RulesModalComponent],
  imports: [CommonModule],
  providers: [provideHttpClient()],
  exports: [RulesModalComponent]
})
export class RulesModalModule { }