import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptativeTabs } from './adaptative-tabs';

describe('AdaptativeTabs', () => {
  let component: AdaptativeTabs;
  let fixture: ComponentFixture<AdaptativeTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptativeTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(AdaptativeTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
