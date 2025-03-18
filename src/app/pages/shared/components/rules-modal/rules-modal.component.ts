import { HttpClient } from "@angular/common/http";
import { Component, Input, OnChanges } from "@angular/core";

declare var $: any;

@Component({
  standalone: false,
  selector: 'rules-modal',
  templateUrl: './rules-modal.component.html',
  styleUrls: ['./rules-modal.component.scss'],
})
export class RulesModalComponent implements OnChanges {
  @Input() contentPath = '';

  content = '';

  constructor(private http: HttpClient) {}

  ngOnChanges() {
    if(this.contentPath) {
      this.loadContent(this.contentPath);
    }
  }

  open() { $("#modal").show() }
  close() { $("#modal").hide() }

  private loadContent(path: string) {
    this.http.get(path, { responseType: 'text' })
    .subscribe(
      (html) => this.content = html,
      (error) => console.error('Erro ao carregar HTML:', error)
    );
  }
}