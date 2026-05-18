import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSubtasksPage } from './task-subtasks-page';

describe('TaskSubtasksPage', () => {
  let component: TaskSubtasksPage;
  let fixture: ComponentFixture<TaskSubtasksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSubtasksPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskSubtasksPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
