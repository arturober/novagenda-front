import { Component, input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'task-item',
  imports: [MatCard],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  task = input.required<Task>();
}
