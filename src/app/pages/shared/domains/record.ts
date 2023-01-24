import { DateUtils } from "src/assets/utils/date-utils";

export class Record {
  userRecord: number;
  date: string;
  worldRecord: number;
  bestPlayer: string;

  constructor() {
    this.userRecord = 0;
    this.worldRecord = 0;
    this.bestPlayer = 'Gabriel';
    this.formatDate(new Date());
  }

  updateWorldRecord(score: number) {
    this.worldRecord = score;
    this.bestPlayer = 'Você';
    this.updatePersonalRecord(score);
  }

  updatePersonalRecord(score: number) {
    this.userRecord = score;
    this.formatDate(new Date());
  }

  formatDate(date: Date) {
    let day: string = DateUtils.formatLeftZero(date.getDate());
    let month: string = DateUtils.formatLeftZero((date.getMonth() + 1));
    let hour: string = DateUtils.formatLeftZero(date.getHours());
    let minute: string = DateUtils.formatLeftZero(date.getMinutes());

    this.date = day + '/' + month + '/' + date.getFullYear() + ' ' + hour + ':' + minute;
  }
}