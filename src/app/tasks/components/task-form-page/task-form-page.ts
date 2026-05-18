import { Platform } from '@angular/cdk/platform';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { Router, RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { TopBar } from '../../../shared/components/top-bar/top-bar';
import { SideMenuService } from '../../../shared/services/side-menu-service';
import { TaskInsert } from '../../interfaces/task';
import { TaskService } from '../../services/task-service';
import { CategoriesService } from '../../../categories/services/categories-service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Category } from '../../../categories/interfaces/category';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryDialog } from '../../../categories/dialogs/new-category-dialog/new-category-dialog';
import { MatCard } from '@angular/material/card';

interface TaskModel {
  title: string;
  description: string;
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  rrule: string | null;
  category: Category | null;
}

@Component({
  selector: 'task-form-page',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    TopBar,
    FormField,
    FormRoot,
    MatSelect,
    MatOption,
    MatSelectTrigger,
    MatSlideToggle,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatIcon,
    MatDatepickerToggleIcon,
    MatSuffix,
    MatDateRangeInput,
    MatDateRangePicker,
    MatStartDate,
    MatEndDate,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
    MatButton,
    RouterLink,
    MatError,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatIconButton,
    MatCard
  ],
  templateUrl: './task-form-page.html',
  styleUrl: './task-form-page.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, provideNativeDateAdapter()],
})
export class TaskFormPage {
  readonly #sideMenuService = inject(SideMenuService);
  readonly #taskService = inject(TaskService);
  readonly #categoriesService = inject(CategoriesService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #snackBar = inject(MatSnackBar);
  readonly #router = inject(Router);
  readonly #dialog = inject(MatDialog);
  readonly platform = inject(Platform);

  isMobileOS = this.platform.IOS || this.platform.ANDROID;

  taskModel = signal<TaskModel>({
    title: '',
    description: '',
    startDate: null,
    startTime: null,
    endDate: null,
    priority: 'LOW',
    rrule: null,
    category: null,
  });

  taskForm = form(
    this.taskModel,
    (schema) => {
      required(schema.title, { message: 'El título es obligatorio.' });
    },
    {
      submission: {
        action: async () => this.addTask(),
      },
    },
  );

  categoriesResource = this.#categoriesService.getCategoriesResource();
  categories = linkedSignal(() =>
    this.categoriesResource.hasValue() ? this.categoriesResource.value().categories : [],
  );
  filteredCategories = linkedSignal(() => this.categories());

  isDateRange = signal(false);
  isAllDay = signal(true);

  priorityLabel = computed(() => {
    switch (this.taskModel().priority) {
      case 'LOW':
        return 'Baja';
      case 'MEDIUM':
        return 'Media';
      case 'HIGH':
        return 'Alta';
    }
  });

  priorityColorClass = computed(() => {
    switch (this.taskModel().priority) {
      case 'LOW':
        return 'text-green-800 dark:text-green-200';
      case 'MEDIUM':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'HIGH':
        return 'text-red-800 dark:text-red-200';
    }
  });

  constructor() {
    const title = this.#router.currentNavigation()?.extras.state?.['title'] as string | undefined;
    this.taskForm.title().controlValue.set(title ?? '');

    effect(() => {
      if (this.isDateRange()) {
        this.taskModel.update((task) => ({ ...task, startTime: null, rrule: null }));
      } else {
        this.taskModel.update((task) => ({ ...task, endDate: null }));
      }
    });

    effect(() => {
      if (this.isAllDay()) {
        this.taskModel.update((task) => ({ ...task, startTime: null }));
      }
    });
  }

  openMenu() {
    this.#sideMenuService.open.set(true);
  }

  addTask() {
    const startDate = this.taskModel().startDate
      ? dayjs(this.taskModel().startDate).format('YYYY-MM-DD')
      : null;
    const endDate = this.taskModel().endDate
      ? dayjs(this.taskModel().endDate).format('YYYY-MM-DD')
      : null;
    const startTime = this.taskModel().startTime
      ? dayjs(this.taskModel().startTime).format('HH:mm')
      : null;
    const task: TaskInsert = { ...this.taskModel(), startDate, endDate, startTime, category: this.taskModel().category?.id };

    this.#taskService
      .insertTask(task)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.#router.navigate(['/tasks']),
        error: (err) =>
          this.#snackBar.open(err.error.message ?? err.error.error, 'Cerrar', {
            duration: 3000,
            panelClass: 'error',
          }),
      });
  }

  getCategoryName(category: Category | null) {
    return category?.name ?? '';
  }

  filterCategories(input: HTMLInputElement) {
    const value = input.value;
    this.filteredCategories.set(
      this.categories().filter((c) =>
        c.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      ),
    );
  }

  openNewCategoryDialog(event: Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    const newTaskDialog = this.#dialog.open(NewCategoryDialog);
    newTaskDialog.afterClosed().subscribe((category: Category | undefined) => {
      if (category) {
        this.categories.update((categories) => categories.concat(category));
        this.taskForm.category().controlValue.set(category);
      }
    });
  }
}
