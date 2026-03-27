import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { AdaptativeTabs } from '../../../shared/components/adaptative-tabs/adaptative-tabs';

@Component({
  selector: 'tasks-page',
  imports: [MatToolbar, MatIcon, AdaptativeTabs],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TasksPage {}
