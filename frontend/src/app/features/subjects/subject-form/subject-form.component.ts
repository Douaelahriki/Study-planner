import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SubjectService } from '../../../core/services/subject.service';

@Component({
  selector: 'app-subject-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './subject-form.component.html'
})
export class SubjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  isEditMode = signal(false);
  subjectId = signal<string | null>(null);
  errorMessage = signal('');

  // Couleurs prédéfinies
  colors = [
    { value: '#EF4444', name: 'Rouge' },
    { value: '#F59E0B', name: 'Orange' },
    { value: '#EAB308', name: 'Jaune' },
    { value: '#10B981', name: 'Vert' },
    { value: '#06B6D4', name: 'Cyan' },
    { value: '#3B82F6', name: 'Bleu' },
    { value: '#6366F1', name: 'Indigo' },
    { value: '#8B5CF6', name: 'Violet' },
    { value: '#EC4899', name: 'Rose' },
    { value: '#6B7280', name: 'Gris' }
  ];

  subjectForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    weeklyGoalHours: [5, [Validators.required, Validators.min(1), Validators.max(60)]],
    color: ['#3B82F6', Validators.required],
    maxSessionDuration: [120, [Validators.required, Validators.min(15), Validators.max(480)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.subjectId.set(id);
      this.loadSubject(id);
    }
  }

  loadSubject(id: string): void {
    this.isLoading.set(true);
    this.subjectService.getSubjectById(id).subscribe({
      next: (response) => {
        this.subjectForm.patchValue({
          name: response.subject.name,
          description: response.subject.description,
          priority: response.subject.priority,
          weeklyGoalHours: response.subject.weeklyGoalHours,
          color: response.subject.color,
          maxSessionDuration: response.subject.maxSessionDuration
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur de chargement');
        this.isLoading.set(false);
      }
    });
  }

  selectColor(color: string): void {
    this.subjectForm.patchValue({ color });
  }

  setPriority(priority: number): void {
    this.subjectForm.patchValue({ priority });
  }

  onSubmit(): void {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const data = this.subjectForm.value;

    if (this.isEditMode() && this.subjectId()) {
      // Mode édition
      this.subjectService.updateSubject(this.subjectId()!, data).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/subjects']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Erreur');
        }
      });
    } else {
      // Mode création
      this.subjectService.createSubject(data).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/subjects']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Erreur');
        }
      });
    }
  }

  // Getters
  get name() { return this.subjectForm.get('name'); }
  get description() { return this.subjectForm.get('description'); }
  get priority() { return this.subjectForm.get('priority'); }
  get weeklyGoalHours() { return this.subjectForm.get('weeklyGoalHours'); }
  get selectedColor() { return this.subjectForm.get('color')?.value; }
  get maxSessionDuration() { return this.subjectForm.get('maxSessionDuration'); }
}