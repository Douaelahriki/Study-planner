import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  users = signal<any[]>([]);
  loading = signal(true);
  apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.http.get<any>(`${this.apiUrl}/users`).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  deleteUser(id: string, name: string): void {
    if (!confirm(`Supprimer l'utilisateur "${name}" ?`)) return;
    this.http.delete(`${this.apiUrl}/users/${id}`).subscribe(() => {
      this.users.update(users => users.filter(u => u._id !== id));
    });
  }

  changeRole(id: string, role: string): void {
    this.http.put(`${this.apiUrl}/users/${id}/role`, { role }).subscribe({
      next: () => {
        this.users.update(users =>
          users.map(u => u._id === id ? { ...u, role } : u)
        );
      }
    });
  }
}