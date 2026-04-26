import { inject, Pipe, PipeTransform } from '@angular/core';
import { DayjsService } from '../services/dayjs-service';


@Pipe({
  name: 'dateRelative',
})
export class DateRelativePipe implements PipeTransform {
  readonly #dayjsService = inject(DayjsService);

  transform(value: string): string {
    return this.#dayjsService.dateToRelative(value);
  }
}
