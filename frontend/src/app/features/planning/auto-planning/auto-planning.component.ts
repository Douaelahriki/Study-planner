import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { PlanningAnalysis, GeneratePlanningResponse, Session } from '../../../core/models/session.model';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-auto-planning',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auto-planning.component.html'
})
export class AutoPlanningComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  isLoadingAnalysis = signal(true);
  isGenerating = signal(false);
  analysis = signal<PlanningAnalysis['analysis'] | null>(null);
  generationResult = signal<GeneratePlanningResponse | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  generationForm: FormGroup = this.fb.group({
    startDate: [this.getTodayDate(), Validators.required],
    numberOfWeeks: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
    clearExisting: [true]
  });

  ngOnInit(): void {
    this.loadAnalysis();
  }

  loadAnalysis(): void {
    this.isLoadingAnalysis.set(true);
    this.sessionService.analyzePlanning().subscribe({
      next: (response) => {
        this.analysis.set(response.analysis);
        this.isLoadingAnalysis.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur de chargement');
        this.isLoadingAnalysis.set(false);
      }
    });
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  generatePlanning(): void {
    if (this.generationForm.invalid) return;

    if (!confirm('🤖 Générer le planning automatique ?\n\n' + 
                 (this.generationForm.value.clearExisting 
                   ? '⚠️ Les sessions auto-générées existantes seront supprimées' 
                   : ''))) {
      return;
    }

    this.isGenerating.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.sessionService.generatePlanning(this.generationForm.value).subscribe({
      next: (response) => {
        this.generationResult.set(response);
        this.successMessage.set(`✅ ${response.sessionsCreated} sessions générées avec succès !`);
        this.isGenerating.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur lors de la génération');
        this.isGenerating.set(false);
      }
    });
  }

  goToSessions(): void {
    this.router.navigate(['/sessions']);
  }

  getSubjectName(session: Session): string {
    if (typeof session.subjectId === 'object' && session.subjectId !== null) {
      return (session.subjectId as Subject).name;
    }
    return 'Matière';
  }

  getSubjectColor(session: Session): string {
    if (typeof session.subjectId === 'object' && session.subjectId !== null) {
      return (session.subjectId as Subject).color;
    }
    return '#3B82F6';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  formatHours(hours: number): string {
    return `${hours}h`;
  }

  isFeasible(): boolean {
    return this.analysis()?.isFeasible ?? false;
  }

  canGenerate(): boolean {
    const a = this.analysis();
    return a !== null && a.hasSubjects && a.hasAvailability;
  }
  // 🆕 Helper pour le template (Math.min ne fonctionne pas dans le template Angular)
clampPercentage(value: number): number {
  return Math.min(value, 100);
}
}