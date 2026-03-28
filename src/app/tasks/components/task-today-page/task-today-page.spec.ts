import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTodayPage } from './task-today-page';

describe('TaskTodayPage', () => {
  let component: TaskTodayPage;
  let fixture: ComponentFixture<TaskTodayPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTodayPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskTodayPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
