import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCategoryDialog } from './tasks-category-dialog';

describe('TasksCategoryDialog', () => {
  let component: TasksCategoryDialog;
  let fixture: ComponentFixture<TasksCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksCategoryDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksCategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
