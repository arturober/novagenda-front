import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCommentsPage } from './task-comments-page';

describe('TaskCommentsPage', () => {
  let component: TaskCommentsPage;
  let fixture: ComponentFixture<TaskCommentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCommentsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCommentsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
