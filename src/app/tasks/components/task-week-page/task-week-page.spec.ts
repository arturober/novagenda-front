import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskWeekPage } from './task-week-page';
import { TaskService } from '../../services/task-service';
import { TasksPage } from '../tasks-page/tasks-page';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../../interfaces/task';
import { vi } from 'vitest';

describe('TaskWeekPage', () => {
  let component: TaskWeekPage;
  let fixture: ComponentFixture<TaskWeekPage>;

  // Create mock signals/subjects
  const mockTasksSignal = signal<{ tasks: Task[] }>({ tasks: [] });
  const mockHasValueSignal = signal<boolean>(true);

  const mockTasklistResource = {
    value: mockTasksSignal,
    hasValue: mockHasValueSignal,
    reload: vi.fn(),
  };

  const mockTaskService = {
    getTasksByDateResource: vi.fn().mockReturnValue(mockTasklistResource),
  };

  const mockTasksPage = {
    reloadTasksEvent$: new Subject<void>(),
  };

  beforeEach(async () => {
    mockTasksSignal.set({ tasks: [] });
    mockHasValueSignal.set(true);
    mockTaskService.getTasksByDateResource.mockClear();
    mockTasklistResource.reload.mockClear();

    await TestBed.configureTestingModule({
      imports: [TaskWeekPage],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: TasksPage, useValue: mockTasksPage },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskWeekPage);
    component = fixture.componentInstance;

    // Set today to a fixed date to have predictable week days
    // Thursday, 2026-05-21 (getDay() is 4)
    component.today.set(new Date('2026-05-21T12:00:00'));

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
