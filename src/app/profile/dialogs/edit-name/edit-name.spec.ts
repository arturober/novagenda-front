import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditName } from './edit-name';

describe('EditName', () => {
  let component: EditName;
  let fixture: ComponentFixture<EditName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditName],
    }).compileComponents();

    fixture = TestBed.createComponent(EditName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
