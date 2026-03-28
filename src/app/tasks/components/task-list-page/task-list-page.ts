import { Component, signal } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { TaskItem } from '../task-item/task-item';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'task-list-page',
  imports: [TaskItem, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon],
  templateUrl: './task-list-page.html',
  styleUrl: './task-list-page.scss',
})
export class TaskListPage {
  pendingExpanded = signal(true);
  tasks = signal<Task[]>([
    {
      id: "1",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "2",
      title: "Comprar entradas",
      priority: "MEDIUM"
    },
    {
      id: "2",
      title: "Sacar al perro",
      priority: "HIGH"
    },
  ]);
}
