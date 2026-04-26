import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInvitationDialog } from './manage-invitation-dialog';

describe('ManageInvitationDialog', () => {
  let component: ManageInvitationDialog;
  let fixture: ComponentFixture<ManageInvitationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageInvitationDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageInvitationDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
