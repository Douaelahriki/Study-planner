import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  UserListResponse, 
  UserDetailResponse, 
  GlobalStats,
  CreateAdminRequest,
  WeeklyProductivityResponse
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/admin';

  getAllUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/users`);
  }

  getUserById(id: string): Observable<UserDetailResponse> {
    return this.http.get<UserDetailResponse>(`${this.apiUrl}/users/${id}`);
  }

  createAdmin(data: CreateAdminRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  getGlobalStats(): Observable<GlobalStats> {
    return this.http.get<GlobalStats>(`${this.apiUrl}/stats`);
  }

  // 🆕 NOUVEAU : Productivité hebdomadaire
  getWeeklyProductivity(): Observable<WeeklyProductivityResponse> {
    return this.http.get<WeeklyProductivityResponse>(`${this.apiUrl}/stats/weekly`);
  }
}