import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskInfoPage } from './task-info-page';

describe('TaskInfoPage', () => {
  let component: TaskInfoPage;
  let fixture: ComponentFixture<TaskInfoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskInfoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskInfoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
