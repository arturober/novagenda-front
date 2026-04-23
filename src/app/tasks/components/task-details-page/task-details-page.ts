import { Component, computed, inject, input } from '@angular/core';
import { TopBar } from '../../../shared/components/top-bar/top-bar';
import { RouterOutlet } from '@angular/router';
import { AdaptativeTabs } from '../../../shared/components/adaptative-tabs/adaptative-tabs';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'task-details-page',
  imports: [TopBar, RouterOutlet, AdaptativeTabs],
  templateUrl: './task-details-page.html',
  styleUrl: './task-details-page.scss',
})
export class TaskDetailsPage {
  id = input.required<string>();

  readonly #taskService = inject(TaskService);
  taskResource = this.#taskService.getTaskResource(this.id);
  task = computed(() => this.taskResource.hasValue() ? this.taskResource.value().task : null);
}
