import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupSession } from '../../../core/models/group-session.model';
import { GroupSessionService } from '../../../core/services/group-session.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-session-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss'
})
export class SessionCardComponent {
  @Input() session!: GroupSession;
  @Output() sessionUpdated = new EventEmitter<GroupSession>();

  showComments = signal(false);
  newComment = signal('');
  loading = signal(false);

  constructor(
    private groupSessionService: GroupSessionService,
    public authService: AuthService
  ) {}

  get myStatus(): string {
    const userId = this.authService.currentUser()?._id;
    const participant = this.session.participants.find(
      p => p.userId._id === userId
    );
    return participant?.status || 'pending';
  }

  get acceptedCount(): number {
    return this.session.participants.filter(p => p.status === 'accepted').length;
  }

  get isCreator(): boolean {
    return this.session.createdBy._id === this.authService.currentUser()?._id;
  }

  respond(status: 'accepted' | 'refused'): void {
    this.loading.set(true);
    this.groupSessionService.respond(this.session._id, status).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.sessionUpdated.emit(res.data);
      },
      error: () => this.loading.set(false)
    });
  }

  submitComment(): void {
    if (!this.newComment().trim()) return;
    this.groupSessionService.addComment(this.session._id, this.newComment()).subscribe({
      next: (res) => {
        this.session.comments.push(res.data);
        this.newComment.set('');
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m}min`;
  }

  getStatusIcon(status: string): string {
    return status === 'accepted' ? '✅' : status === 'refused' ? '❌' : '⏳';
  }
}