import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/es'; // Importas el idioma español

@Injectable({
  providedIn: 'root',
})
export class DayjsService {
  #calendarConfig = {
    sameDay: '[Hoy]',          // Si es el mismo día calendario
    nextDay: '[Mañana]',       // El día siguiente
    nextWeek: 'dddd',          // Ejemplo: "lunes"
    lastDay: '[Ayer]',         // El día anterior
    lastWeek: '[el] dddd [pasado]', // Ejemplo: "el martes pasado"
    sameElse: 'DD/MM/YYYY'     // Formato por defecto para fechas lejanas
  };

  constructor() {
    dayjs.extend(relativeTime);
    dayjs.extend(calendar);
    dayjs.extend(isBetween)
    dayjs.locale('es');
  }

  dateToRelative(date: string) {
    const today = dayjs();
    const dateJS = dayjs(date);
    const nextWeek = dateJS.add(1, 'week');
    const lastWeek = dateJS.subtract(1, 'week');
    console.log(lastWeek.toISOString(), nextWeek.toISOString());
    if(today.isBetween(lastWeek, nextWeek, 'day')) {
      return dayjs(date).calendar(today, this.#calendarConfig);

    } else {
      return dayjs(date).fromNow();
    }
  }
}
