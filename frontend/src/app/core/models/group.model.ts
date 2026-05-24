import { User } from './user.model';

export interface Invitation {
  userId: User;
  status: 'pending' | 'accepted' | 'refused';
  invitedAt: string;
}

export interface Group {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: User[];
  invitations?: Invitation[];
  isPrivate: boolean;
  avatar?: string;
  createdAt?: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}