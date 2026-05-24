import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Notification, NotificationsResponse } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/notifications';

  unreadCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<NotificationsResponse> {
    return this.http.get<NotificationsResponse>(this.apiUrl).pipe(
      tap(res => this.unreadCount.set(res.unreadCount))
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => this.unreadCount.set(0))
    );
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}