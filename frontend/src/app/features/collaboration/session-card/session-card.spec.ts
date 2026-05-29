import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCard } from './session-card';

describe('SessionCard', () => {
  let component: SessionCard;
  let fixture: ComponentFixture<SessionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
