import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { SubjectService } from '../../../core/services/subject.service';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-session-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './session-form.component.html'
})
export class SessionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  isEditMode = signal(false);
  sessionId = signal<string | null>(null);
  errorMessage = signal('');
  subjects = signal<Subject[]>([]);

  sessionForm: FormGroup = this.fb.group({
    subjectId: ['', Validators.required],
    title: [''],
    date: [this.getTodayDate(), Validators.required],
    startTime: ['09:00', Validators.required],
    endTime: ['10:00', Validators.required],
    notes: ['']
  });

  ngOnInit(): void {
    this.loadSubjects();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.sessionId.set(id);
      this.loadSession(id);
    }
  }

  loadSubjects(): void {
    this.subjectService.getMySubjects().subscribe({
      next: (response) => {
        this.subjects.set(response.subjects);
        if (response.subjects.length === 0) {
          this.errorMessage.set('Vous devez d\'abord créer au moins une matière');
        }
      },
      error: () => {
        this.errorMessage.set('Erreur de chargement des matières');
      }
    });
  }

  loadSession(id: string): void {
    this.isLoading.set(true);
    this.sessionService.getSessionById(id).subscribe({
      next: (response) => {
        const session = response.session;
        const subjectId = typeof session.subjectId === 'object' ? session.subjectId._id : session.subjectId;
        const date = new Date(session.date).toISOString().split('T')[0];

        this.sessionForm.patchValue({
          subjectId,
          title: session.title || '',
          date,
          startTime: session.startTime,
          endTime: session.endTime,
          notes: session.notes || ''
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur de chargement');
        this.isLoading.set(false);
      }
    });
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  calculateDuration(): string {
    const start = this.startTime?.value;
    const end = this.endTime?.value;
    if (!start || !end) return '';
    
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);
    const minutes = (eH * 60 + eM) - (sH * 60 + sM);
    
    if (minutes <= 0) return '⚠️ Durée invalide';
    
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h === 0 ? `${m}min` : (m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, '0')}`);
  }

  onSubmit(): void {
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const data = this.sessionForm.value;

    if (this.isEditMode() && this.sessionId()) {
      this.sessionService.updateSession(this.sessionId()!, data).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/sessions']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Erreur');
        }
      });
    } else {
      this.sessionService.createSession(data).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/sessions']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Erreur');
        }
      });
    }
  }

  // Getters
  get subjectId() { return this.sessionForm.get('subjectId'); }
  get title() { return this.sessionForm.get('title'); }
  get date() { return this.sessionForm.get('date'); }
  get startTime() { return this.sessionForm.get('startTime'); }
  get endTime() { return this.sessionForm.get('endTime'); }
  get notes() { return this.sessionForm.get('notes'); }
  
  getSelectedSubject(): Subject | undefined {
    const id = this.subjectId?.value;
    return this.subjects().find(s => s._id === id);
  }
}