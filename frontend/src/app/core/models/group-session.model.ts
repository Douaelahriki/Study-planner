import { User } from './user.model';

export interface Participant {
  userId: User;
  status: 'pending' | 'accepted' | 'refused';
  respondedAt?: string;
}

export interface Comment {
  _id: string;
  userId: User;
  content: string;
  createdAt: string;
}

export interface GroupSession {
  _id: string;
  groupId: string;
  createdBy: User;
  title: string;
  subject: string;
  date: string;
  startTime: string;
  duration: number;
  participants: Participant[];
  comments: Comment[];
  status: 'active' | 'cancelled';
  createdAt: string;
}

export interface CreateGroupSessionRequest {
  groupId: string;
  title: string;
  subject: string;
  date: string;
  startTime: string;
  duration: number;
}