import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

export interface ConfirmButton {
  text: string;
  value: boolean | string | number;
}

export interface ConfirmDialogConfig {
  title: string;
  text: string;
  buttons?: ConfirmButton[];
}

@Component({
  selector: 'confirm-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
    readonly data = inject<ConfirmDialogConfig>(MAT_DIALOG_DATA);

}
