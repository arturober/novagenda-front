import { TestBed } from '@angular/core/testing';
import { TaskInvitationService } from './task-invitation-service';


describe('TaskInvitationService', () => {
  let service: TaskInvitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskInvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
