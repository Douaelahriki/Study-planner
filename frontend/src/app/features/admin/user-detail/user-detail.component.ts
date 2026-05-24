import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user = signal<User | null>(null);
  stats = signal<any>(null);
  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(id);
    } else {
      this.router.navigate(['/admin/users']);
    }
  }

  loadUser(id: string): void {
    this.isLoading.set(true);
    this.adminService.getUserById(id).subscribe({
      next: (response) => {
        this.user.set(response.user);
        this.stats.set(response.stats);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur de chargement');
        this.isLoading.set(false);
      }
    });
  }

  

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'Inconnue';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getCompletionRate(): number {
    const s = this.stats();
    if (!s || s.sessionsCount === 0) return 0;
    return Math.round((s.completedSessions / s.sessionsCount) * 100);
  }
}