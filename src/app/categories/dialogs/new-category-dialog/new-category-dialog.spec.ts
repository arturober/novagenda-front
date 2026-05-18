import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoryDialog } from './new-category-dialog';

describe('NewCategoryDialog', () => {
  let component: NewCategoryDialog;
  let fixture: ComponentFixture<NewCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCategoryDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(NewCategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
