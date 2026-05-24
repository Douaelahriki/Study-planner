import { User } from './user.model';

export interface Message {
  _id: string;
  groupId: string;
  senderId: User;
  content: string;
  type: 'text' | 'session-invite' | 'system';
  sessionId?: string;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  type?: string;
  sessionId?: string;
}