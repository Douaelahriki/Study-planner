import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupSession, CreateGroupSessionRequest } from '../models/group-session.model';

@Injectable({ providedIn: 'root' })
export class GroupSessionService {
  private apiUrl = 'http://localhost:3000/api/group-sessions';

  constructor(private http: HttpClient) {}

  createSession(data: CreateGroupSessionRequest): Observable<{ success: boolean; data: GroupSession }> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getGroupSessions(groupId: string): Observable<{ success: boolean; data: GroupSession[] }> {
    return this.http.get<any>(`${this.apiUrl}/group/${groupId}`);
  }

  respond(sessionId: string, status: 'accepted' | 'refused'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${sessionId}/respond`, { status });
  }

  addComment(sessionId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${sessionId}/comments`, { content });
  }
}