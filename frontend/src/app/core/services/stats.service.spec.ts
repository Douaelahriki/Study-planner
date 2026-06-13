import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatsService]
    });
    service = TestBed.inject(StatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call correct URL for getSummary', () => {
    service.getSummary().subscribe();
    const req = httpMock.expectOne('http://localhost:3000/api/stats/summary');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: {} });
  });

  it('should call correct URL for getWeekly', () => {
    service.getWeekly().subscribe();
    const req = httpMock.expectOne('http://localhost:3000/api/stats/weekly');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [] });
  });

  it('should call correct URL for getBySubject', () => {
    service.getBySubject().subscribe();
    const req = httpMock.expectOne('http://localhost:3000/api/stats/by-subject');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [] });
  });
});