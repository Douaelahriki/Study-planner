import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../core/services/group.service';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-form.html',
  styleUrl: './group-form.scss'
})
export class GroupFormComponent {
  @Output() groupCreated = new EventEmitter<void>();

  name = signal('');
  description = signal('');
  isPrivate = signal(true);
  loading = signal(false);
  error = signal('');

  constructor(private groupService: GroupService) {}

  submit(): void {
    if (!this.name().trim()) {
      this.error.set('Le nom est obligatoire');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.groupService.createGroup({
      name: this.name(),
      description: this.description(),
      isPrivate: this.isPrivate()
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.groupCreated.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de la création');
      }
    });
  }
} 