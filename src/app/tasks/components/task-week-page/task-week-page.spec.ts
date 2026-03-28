import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskWeekPage } from './task-week-page';

describe('TaskWeekPage', () => {
  let component: TaskWeekPage;
  let fixture: ComponentFixture<TaskWeekPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskWeekPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskWeekPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
