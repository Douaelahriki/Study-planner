import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubjectService } from '../../../core/services/subject.service';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-subject-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './subject-list.component.html'
})
export class SubjectListComponent implements OnInit {
  private subjectService = inject(SubjectService);

  subjects = signal<Subject[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.isLoading.set(true);
    this.subjectService.getMySubjects().subscribe({
      next: (response) => {
        this.subjects.set(response.subjects);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur de chargement');
        this.isLoading.set(false);
      }
    });
  }

  filteredSubjects(): Subject[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.subjects();
    
    return this.subjects().filter(s => 
      s.name.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term)
    );
  }

  deleteSubject(subject: Subject): void {
    if (!confirm(`⚠️ Supprimer "${subject.name}" et toutes les sessions associées ?`)) {
      return;
    }

    this.subjectService.deleteSubject(subject._id).subscribe({
      next: () => {
        this.successMessage.set(`"${subject.name}" supprimée`);
        this.loadSubjects();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  getPriorityStars(priority: number): string {
    return '⭐'.repeat(priority);
  }

  getPriorityLabel(priority: number): string {
    const labels = ['', 'Très basse', 'Basse', 'Moyenne', 'Haute', 'Très haute'];
    return labels[priority] || 'Moyenne';
  }
}