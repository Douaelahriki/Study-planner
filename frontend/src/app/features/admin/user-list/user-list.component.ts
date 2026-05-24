import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  private adminService = inject(AdminService);
  authService = inject(AuthService);

  users = signal<User[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  searchTerm = signal('');
  selectedRole = signal<'all' | 'user' | 'admin'>('all');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur de chargement');
        this.isLoading.set(false);
      }
    });
  }

  filteredUsers(): User[] {
    let filtered = this.users();
    
    if (this.selectedRole() !== 'all') {
      filtered = filtered.filter(u => u.role === this.selectedRole());
    }
    
    const term = this.searchTerm().toLowerCase();
    if (term) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }

  deleteUser(user: User): void {
    if (!confirm(`⚠️ Supprimer définitivement ${user.name} et toutes ses données ?`)) {
      return;
    }

    this.adminService.deleteUser(user._id || user.id).subscribe({
      next: () => {
        this.successMessage.set(`${user.name} a été supprimé`);
        this.loadUsers();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  isCurrentUser(user: User): boolean {
  const userId = user._id || user.id;
  const currentUserId = this.authService.currentUser()?._id || this.authService.currentUser()?.id;
  return userId === currentUserId;
}

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onRoleFilter(role: 'all' | 'user' | 'admin'): void {
    this.selectedRole.set(role);
  }
}