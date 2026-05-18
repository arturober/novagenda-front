import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  // 1. Aquí mantienes la lista de todos tus archivos SVG (sin la extensión .svg)
  // Siempre deben coincidir exactamente con el nombre del archivo en assets/icons/
  private readonly ICONS = [
    'home',
    'close',
    'eye-visible',
    'eye-hidden',
    'select-check-box',
    'menu',
    'add',
    'add-task',
    'date-range',
    'today',
    'calendar-month',
    'list-alt',
    'logout',
    'checklist',
    'category',
    'more-vert',
    'edit',
    'delete',
    'circle_filled',
    'calendar-today',
    'schedule',
    'repeat',
    'chat',
    'check-box',
    'info',
    'group',
    'arrow-back',
    'flag',
    'pending',
    'check',
    'avg-pace',
    'send',
  ];

  public registerIcons(): void {
    this.ICONS.forEach(iconName => {
      this.iconRegistry.addSvgIcon(
        iconName,
        this.sanitizer.bypassSecurityTrustResourceUrl(`/icons/${iconName}.svg`)
      );
    });
  }
}
