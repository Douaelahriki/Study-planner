import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  // Signals Angular 21
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  currentUser = this.currentUserSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  isLoggedIn = computed(() => !!this.tokenSignal());
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.tokenSignal.set(res.token);
    this.currentUserSignal.set(res.user);
  }

  private getUserFromStorage(): User | null {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
}
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}