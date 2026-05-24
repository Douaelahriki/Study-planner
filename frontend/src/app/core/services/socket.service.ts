import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  private serverUrl = 'http://localhost:3000';

  constructor(private authService: AuthService) {}

  connect(): void {
    const token = this.authService.getToken();
    if (!token || this.socket?.connected) return;

    this.socket = io(this.serverUrl, {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('connect', () => console.log('🔌 Socket connecté'));
    this.socket.on('disconnect', () => console.log('🔌 Socket déconnecté'));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinGroup(groupId: string): void {
    this.socket?.emit('join-group', groupId);
  }

  leaveGroup(groupId: string): void {
    this.socket?.emit('leave-group', groupId);
  }

  sendMessage(groupId: string, content: string): void {
    this.socket?.emit('send-message', { groupId, content, type: 'text' });
  }

  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('new-message', (data) => observer.next(data));
    });
  }

  onUserTyping(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('user-typing', (data) => observer.next(data));
    });
  }

  emitTyping(groupId: string): void {
    this.socket?.emit('typing', groupId);
  }

  emitStopTyping(groupId: string): void {
    this.socket?.emit('stop-typing', groupId);
  }
}