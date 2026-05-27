import { Component, computed, DestroyRef, inject, signal, untracked } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import {
  MatDialogClose,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatChip } from '@angular/material/chips';
import { CategoriesService } from '../../services/categories-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, SingleCategoryResponse } from '../../interfaces/category';
import { Observable } from 'rxjs';

interface NewCategoryModel {
  name: string;
  description: string;
  bgColor: string;
}

@Component({
  selector: 'new-category-dialog',
  imports: [
    MatDialogClose,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatFormField,
    MatLabel,
    FormField,
    FormRoot,
    MatInput,
    MatChip,
  ],
  templateUrl: './new-category-dialog.html',
  styleUrl: './new-category-dialog.scss',
})
export class NewCategoryDialog {
  readonly #dialogRef = inject(MatDialogRef<NewCategoryDialog>);
  readonly #destroyRef = inject(DestroyRef);
  readonly #categoriesService = inject(CategoriesService);
  readonly #snackBar = inject(MatSnackBar);
  readonly category = inject<Category | null>(MAT_DIALOG_DATA);

  categoryModel = signal<NewCategoryModel>({
    name: this.category?.name ?? '',
    description: this.category?.description ?? '',
    bgColor: this.category?.bgColor ?? '#ffffff',
  });

  categoryForm = form(
    this.categoryModel,
    (schema) => {
      required(schema.name, { message: 'El nombre es obligatorio' });
      required(schema.bgColor, { message: 'El color es obligatorio' });
    },
    {
      submission: {
        action: async () => this.saveCategory(),
      },
    },
  );

  textColor = computed(() => {
    const bgColor = this.categoryModel().bgColor;
    return untracked(() => {
      const hsl = this.hexToHSL(bgColor);
      if (hsl.l > 62) {
        return `hsl(${hsl.h} ${hsl.s}% 15%)`;
      } else {
        return `hsl(${hsl.h} ${hsl.s}% 90%)`;
      }
    });
  });

  saveCategory() {
    let saveAction$: Observable<SingleCategoryResponse>;
    if (this.category) {
      saveAction$ = this.#categoriesService.updateCategory(this.category.id, { ...this.categoryModel(), color: this.textColor() });
    } else {
      saveAction$ = this.#categoriesService.insertCategory({ ...this.categoryModel(), color: this.textColor() });
    }
    saveAction$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (resp) => this.#dialogRef.close(resp.category),
        error: (err) =>
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          }),
      });
  }

  private hexToHSL(hex: string) {
    // 1. Convertir Hex a RGB
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }
}
