import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeIntl',
})
export class TimeIntlPipe implements PipeTransform {
  transform(value: string, lang: string): string {
    return new Date('2020-01-01T' + value).toLocaleTimeString(lang, {
      hour: 'numeric',
      minute: '2-digit',
      dayPeriod: 'long',
      hour12: true
    });
  }
}
