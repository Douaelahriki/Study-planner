import { User } from './user.model';

export interface UserListResponse {
  success: boolean;
  count: number;
  users: User[];
}

export interface UserDetailResponse {
  success: boolean;
  user: User;
  stats: {
    subjectsCount: number;
    sessionsCount: number;
    completedSessions: number;
  };
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface GlobalStats {
  success: boolean;
  stats: {
    users: {
      total: number;
      admins: number;
      regularUsers: number;
      newUsersLastWeek: number;
    };
    content: {
      totalSubjects: number;
      totalSessions: number;
    };
    sessions: {
      completed: number;
      planned: number;
      missed: number;
    };
    productivity: {
      totalHoursStudied: number;
      totalMinutesStudied: number;
    };
  };
}

// 🆕 NOUVEAU : Stats hebdomadaires
export interface WeeklyDayStat {
  day: string;
  date: string;
  completed: number;
  total: number;
  hours: number;
}

export interface WeeklyProductivityResponse {
  success: boolean;
  weekStart: string;
  weekEnd: string;
  weeklyStats: WeeklyDayStat[];
}