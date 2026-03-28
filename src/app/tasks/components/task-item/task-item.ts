import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'task-item',
  imports: [MatCard],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {}
