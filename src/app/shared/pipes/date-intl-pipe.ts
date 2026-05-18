import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateIntl',
})
export class DateIntlPipe implements PipeTransform {
  transform(
    value: string | Date,
    lang: string,
    dateStyle?: 'full' | 'long' | 'short' | 'medium',
  ): string {
    return new Date(value).toLocaleDateString(lang, {
      dateStyle,
    });
  }
}
