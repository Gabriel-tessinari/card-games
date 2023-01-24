export class DateUtils {
  static formatLeftZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}