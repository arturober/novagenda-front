import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskColabPage } from './task-colab-page';

describe('TaskColabPage', () => {
  let component: TaskColabPage;
  let fixture: ComponentFixture<TaskColabPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskColabPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskColabPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
