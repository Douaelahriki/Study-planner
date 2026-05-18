import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Session, 
  SessionListResponse, 
  SessionResponse, 
  CreateSessionRequest,
  SessionsStats,
  PlanningAnalysis,           // ← AJOUTÉ
  GeneratePlanningRequest,    // ← AJOUTÉ
  GeneratePlanningResponse    // ← AJOUTÉ
} from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/sessions';

  getMySessions(filters?: { status?: string; startDate?: string; endDate?: string; subjectId?: string }): Observable<SessionListResponse> {
    let params = '';
    if (filters) {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.subjectId) queryParams.append('subjectId', filters.subjectId);
      params = queryParams.toString() ? '?' + queryParams.toString() : '';
    }
    return this.http.get<SessionListResponse>(this.apiUrl + params);
  }

  getSessionById(id: string): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(`${this.apiUrl}/${id}`);
  }

  createSession(data: CreateSessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(this.apiUrl, data);
  }

  updateSession(id: string, data: Partial<CreateSessionRequest>): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteSession(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  completeSession(id: string, actualDuration?: number): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(`${this.apiUrl}/${id}/complete`, { actualDuration });
  }

  missSession(id: string): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(`${this.apiUrl}/${id}/miss`, {});
  }

  getStats(): Observable<SessionsStats> {
    return this.http.get<SessionsStats>(`${this.apiUrl}/stats`);
  }

  // 🆕 NOUVEAU : Analyser la faisabilité
analyzePlanning(): Observable<PlanningAnalysis> {
  return this.http.get<PlanningAnalysis>(`${this.apiUrl}/analyze`);
}

// 🆕 NOUVEAU : Générer le planning automatique
generatePlanning(data: GeneratePlanningRequest): Observable<GeneratePlanningResponse> {
  return this.http.post<GeneratePlanningResponse>(`${this.apiUrl}/generate`, data);
}
}