export interface Subject {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  priority: number;
  weeklyGoalHours: number;
  color: string;
  maxSessionDuration: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubjectListResponse {
  success: boolean;
  count: number;
  subjects: Subject[];
}

export interface SubjectResponse {
  success: boolean;
  message?: string;
  subject: Subject;
}

export interface CreateSubjectRequest {
  name: string;
  description?: string;
  priority: number;
  weeklyGoalHours: number;
  color: string;
  maxSessionDuration?: number;
}