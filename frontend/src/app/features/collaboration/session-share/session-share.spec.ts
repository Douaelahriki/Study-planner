import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionShare } from './session-share';

describe('SessionShare', () => {
  let component: SessionShare;
  let fixture: ComponentFixture<SessionShare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionShare],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionShare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
