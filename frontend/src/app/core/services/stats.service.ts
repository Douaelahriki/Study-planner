import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsSummary, SubjectStat, DayStat, ComparisonStat } from '../models/stats.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private apiUrl = 'http://localhost:3000/api/stats';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<{ success: boolean; data: StatsSummary }> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  getBySubject(): Observable<{ success: boolean; data: SubjectStat[] }> {
    return this.http.get<any>(`${this.apiUrl}/by-subject`);
  }

  getWeekly(): Observable<{ success: boolean; data: DayStat[] }> {
    return this.http.get<any>(`${this.apiUrl}/weekly`);
  }

  getComparison(): Observable<{ success: boolean; data: ComparisonStat[] }> {
    return this.http.get<any>(`${this.apiUrl}/comparison`);
  }
  getGlobalStats(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/admin/global`);
}
}