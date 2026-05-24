import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, CreateGroupRequest } from '../models/group.model';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private apiUrl = 'http://localhost:3000/api/groups';

  constructor(private http: HttpClient) {}

  getMyGroups(): Observable<{ success: boolean; data: Group[] }> {
    return this.http.get<any>(this.apiUrl);
  }

  createGroup(data: CreateGroupRequest): Observable<{ success: boolean; data: Group }> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getGroupById(id: string): Observable<{ success: boolean; data: Group }> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteGroup(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  inviteMember(groupId: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/invite`, { email });
  }

  respondInvitation(groupId: string, status: 'accepted' | 'refused'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${groupId}/respond`, { status });
  }

  getMessages(groupId: string, page = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/${groupId}/messages?page=${page}`);
  }

  sendMessage(groupId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/messages`, { content });
  }
}