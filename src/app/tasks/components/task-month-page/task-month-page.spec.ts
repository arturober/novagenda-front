import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMonthPage } from './task-month-page';

describe('TaskMonthPage', () => {
  let component: TaskMonthPage;
  let fixture: ComponentFixture<TaskMonthPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskMonthPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskMonthPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
