import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es'; // Importas el idioma español

@Injectable({
  providedIn: 'root',
})
export class DayjsService {
  constructor() {
    dayjs.extend(relativeTime);
    dayjs.locale('es');
  }

  dateToRelative(date: Date | string) {
    return dayjs(date).fromNow();
  }
}
