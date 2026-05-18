import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewColabDialog } from './new-colab-dialog';

describe('NewColabDialog', () => {
  let component: NewColabDialog;
  let fixture: ComponentFixture<NewColabDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewColabDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(NewColabDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
