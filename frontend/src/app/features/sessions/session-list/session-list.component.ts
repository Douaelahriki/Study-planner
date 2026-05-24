import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { Session, SessionStatus, STATUS_LABELS, STATUS_COLORS } from '../../../core/models/session.model';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-session-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './session-list.component.html'
})
export class SessionListComponent implements OnInit {
  private sessionService = inject(SessionService);

  sessions = signal<Session[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  selectedFilter = signal<'all' | SessionStatus>('all');

  // Stats computed
  stats = computed(() => {
    const all = this.sessions();
    return {
      total: all.length,
      planned: all.filter(s => s.status === 'planned').length,
      completed: all.filter(s => s.status === 'completed').length,
      missed: all.filter(s => s.status === 'missed').length
    };
  });

  // Sessions filtrées
  filteredSessions = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'all') return this.sessions();
    return this.sessions().filter(s => s.status === filter);
  });

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading.set(true);
    this.sessionService.getMySessions().subscribe({
      next: (response) => {
        this.sessions.set(response.sessions);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur de chargement');
        this.isLoading.set(false);
      }
    });
  }

  setFilter(filter: 'all' | SessionStatus): void {
    this.selectedFilter.set(filter);
  }

  getSubjectName(session: Session): string {
    if (typeof session.subjectId === 'object' && session.subjectId !== null) {
      return (session.subjectId as Subject).name;
    }
    return 'Matière inconnue';
  }

  getSubjectColor(session: Session): string {
    if (typeof session.subjectId === 'object' && session.subjectId !== null) {
      return (session.subjectId as Subject).color;
    }
    return '#3B82F6';
  }

  getStatusLabel(status: SessionStatus): string {
    return STATUS_LABELS[status] || status;
  }

  getStatusColor(status: SessionStatus): string {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h${m.toString().padStart(2, '0')}`;
  }

  completeSession(session: Session): void {
    if (!confirm(`Marquer "${this.getSubjectName(session)}" comme complétée ?`)) return;

    this.sessionService.completeSession(session._id).subscribe({
      next: () => {
        this.successMessage.set('Session complétée 🎉');
        this.loadSessions();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur');
      }
    });
  }

  missSession(session: Session): void {
    if (!confirm(`Marquer "${this.getSubjectName(session)}" comme manquée ?`)) return;

    this.sessionService.missSession(session._id).subscribe({
      next: () => {
        this.successMessage.set('Session marquée comme manquée');
        this.loadSessions();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur');
      }
    });
  }

  deleteSession(session: Session): void {
    if (!confirm(`Supprimer cette session ?`)) return;

    this.sessionService.deleteSession(session._id).subscribe({
      next: () => {
        this.successMessage.set('Session supprimée');
        this.loadSessions();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur');
      }
    });
  }
}