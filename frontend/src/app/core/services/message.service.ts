import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, SendMessageRequest } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/groups';

  constructor(private http: HttpClient) {}

  getMessages(groupId: string, page = 1): Observable<{ success: boolean; data: Message[] }> {
    return this.http.get<any>(`${this.apiUrl}/${groupId}/messages?page=${page}&limit=50`);
  }

  sendMessage(groupId: string, data: SendMessageRequest): Observable<{ success: boolean; data: Message }> {
    return this.http.post<any>(`${this.apiUrl}/${groupId}/messages`, data);
  }
}