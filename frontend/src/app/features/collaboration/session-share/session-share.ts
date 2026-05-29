import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupSessionService } from '../../../core/services/group-session.service';

@Component({
  selector: 'app-session-share',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-share.html',
  styleUrl: './session-share.scss'
})
export class SessionShareComponent {
  @Input() groupId!: string;
  @Output() sessionShared = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  title = signal('');
  subject = signal('');
  date = signal('');
  startTime = signal('');
  duration = signal(60);
  loading = signal(false);
  error = signal('');

  constructor(private groupSessionService: GroupSessionService) {}

  submit(): void {
    if (!this.title() || !this.subject() || !this.date() || !this.startTime()) {
      this.error.set('Tous les champs sont obligatoires');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.groupSessionService.createSession({
      groupId: this.groupId,
      title: this.title(),
      subject: this.subject(),
      date: this.date(),
      startTime: this.startTime(),
      duration: this.duration()
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.sessionShared.emit(res.data);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur');
      }
    });
  }
}