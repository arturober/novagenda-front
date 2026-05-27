import { Component, inject, linkedSignal, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Category } from '../../../categories/interfaces/category';
import { TaskItem } from '../../components/task-item/task-item';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'tasks-category-dialog',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatButton,
    TaskItem,
  ],
  templateUrl: './tasks-category-dialog.html',
  styleUrl: './tasks-category-dialog.scss',
})
export class TasksCategoryDialog {
  readonly #dialogRef = inject(MatDialogRef<TasksCategoryDialog>);
  readonly category = inject<Category>(MAT_DIALOG_DATA);
  readonly #taskService = inject(TaskService);
  categoryId = signal(this.category.id);

  tasksResource = this.#taskService.getTasksByCategoryResource(this.categoryId)

  tasks = linkedSignal(() => this.tasksResource.hasValue() ? this.tasksResource.value().tasks : []);

  close(): void {
    this.#dialogRef.close();
  }

  removeTask(task: Task): void {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
  }
}
