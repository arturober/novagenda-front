import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDayDialog } from './tasks-day-dialog';

describe('TasksDayDialog', () => {
  let component: TasksDayDialog;
  let fixture: ComponentFixture<TasksDayDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksDayDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksDayDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
