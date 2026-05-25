import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmButton {
  text: string;
  value: boolean | string | number;
}

export interface ConfirmDialogConfig {
  title: string;
  buttons?: ConfirmButton[];
}

@Component({
  selector: 'confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
    readonly buttons = inject<ConfirmDialogConfig>(MAT_DIALOG_DATA);

}
