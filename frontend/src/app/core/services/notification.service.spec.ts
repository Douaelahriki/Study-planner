import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have unreadCount = 0 by default', () => {
    expect(service.unreadCount()).toBe(0);
  });

  it('should update unreadCount after getNotifications', () => {
    const mockResponse = {
      success: true,
      data: [],
      unreadCount: 3
    };

    service.getNotifications().subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/notifications');
    req.flush(mockResponse);

    expect(service.unreadCount()).toBe(3);
  });

  it('should reset unreadCount to 0 after markAllAsRead', () => {
    service.unreadCount.set(5);
    service.markAllAsRead().subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/notifications/read-all');
    req.flush({ success: true });

    expect(service.unreadCount()).toBe(0);
  });
});