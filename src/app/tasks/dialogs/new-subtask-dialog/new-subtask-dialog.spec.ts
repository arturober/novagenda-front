import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubtaskDialog } from './new-subtask-dialog';

describe('NewSubtaskDialog', () => {
  let component: NewSubtaskDialog;
  let fixture: ComponentFixture<NewSubtaskDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSubtaskDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(NewSubtaskDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
