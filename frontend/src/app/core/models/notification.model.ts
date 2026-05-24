export interface Notification {
  _id: string;
  userId: string;
  type: 'reminder' | 'invitation' | 'goal_reached' | 'session_completed' | 'group_message';
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
  relatedModel?: string;
  link?: string;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  unreadCount: number;
}