export interface User {
  id: string;
  _id?: string;          // ← AJOUT : pour compatibilité MongoDB
  name: string;
  email: string;
  role: 'user' | 'admin';
  availability?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Availability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}