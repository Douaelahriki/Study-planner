import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvailabilityService } from '../../../core/services/availability.service';
import { 
  Availability, 
  DayOfWeek, 
  DAYS_FR, 
  DAYS_ORDER, 
  calculateDuration, 
  formatDuration 
} from '../../../core/models/availability.model';

@Component({
  selector: 'app-availability-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './availability-form.component.html'
})
export class AvailabilityFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private availabilityService = inject(AvailabilityService);

  availability = signal<Availability[]>([]);
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showAddForm = signal(false);
  editingIndex = signal<number | null>(null);

  // Pour les templates
  days = DAYS_ORDER;
  daysFr = DAYS_FR;

  slotForm: FormGroup = this.fb.group({
    day: ['monday', Validators.required],
    startTime: ['09:00', Validators.required],
    endTime: ['11:00', Validators.required]
  });

  // Computed : créneaux groupés par jour
  groupedByDay = computed(() => {
    const grouped: Record<DayOfWeek, { slot: Availability; index: number }[]> = {
      monday: [], tuesday: [], wednesday: [], thursday: [],
      friday: [], saturday: [], sunday: []
    };
    
    this.availability().forEach((slot, index) => {
      grouped[slot.day].push({ slot, index });
    });
    
    Object.keys(grouped).forEach(day => {
      grouped[day as DayOfWeek].sort((a, b) => 
        a.slot.startTime.localeCompare(b.slot.startTime)
      );
    });
    
    return grouped;
  });

  // Computed : total d'heures par semaine
  totalMinutes = computed(() => {
    return this.availability().reduce((total, slot) => 
      total + calculateDuration(slot.startTime, slot.endTime), 0
    );
  });

  totalHours = computed(() => {
    return formatDuration(this.totalMinutes());
  });

  ngOnInit(): void {
    this.loadAvailability();
  }

  loadAvailability(): void {
    this.isLoading.set(true);
    this.availabilityService.getMyAvailability().subscribe({
      next: (response) => {
        this.availability.set(response.availability);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur de chargement');
        this.isLoading.set(false);
      }
    });
  }

  openAddForm(): void {
    this.editingIndex.set(null);
    this.slotForm.reset({
      day: 'monday',
      startTime: '09:00',
      endTime: '11:00'
    });
    this.showAddForm.set(true);
  }

  openEditForm(index: number): void {
    const slot = this.availability()[index];
    this.editingIndex.set(index);
    this.slotForm.patchValue({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime
    });
    this.showAddForm.set(true);
  }

  closeForm(): void {
    this.showAddForm.set(false);
    this.editingIndex.set(null);
    this.errorMessage.set('');
  }

  onSubmit(): void {
    if (this.slotForm.invalid) {
      this.slotForm.markAllAsTouched();
      return;
    }

    const slot: Availability = this.slotForm.value;
    this.isSaving.set(true);
    this.errorMessage.set('');

    const editIndex = this.editingIndex();

    if (editIndex !== null) {
      this.availabilityService.updateAvailability(editIndex, slot).subscribe({
        next: (response) => {
          this.availability.set(response.availability);
          this.successMessage.set('Créneau modifié avec succès');
          this.closeForm();
          this.isSaving.set(false);
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Erreur');
          this.isSaving.set(false);
        }
      });
    } else {
      this.availabilityService.addAvailability(slot).subscribe({
        next: (response) => {
          this.availability.set(response.availability);
          this.successMessage.set('Créneau ajouté avec succès');
          this.closeForm();
          this.isSaving.set(false);
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message || 'Erreur');
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteSlot(index: number): void {
    const slot = this.availability()[index];
    const dayName = DAYS_FR[slot.day];
    
    if (!confirm(`Supprimer ${dayName} ${slot.startTime} - ${slot.endTime} ?`)) {
      return;
    }

    this.availabilityService.deleteAvailability(index).subscribe({
      next: (response) => {
        this.availability.set(response.availability);
        this.successMessage.set('Créneau supprimé');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Erreur');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  getSlotDuration(slot: Availability): string {
    return formatDuration(calculateDuration(slot.startTime, slot.endTime));
  }

  getDayMinutes(day: DayOfWeek): number {
    return this.groupedByDay()[day].reduce(
      (total, { slot }) => total + calculateDuration(slot.startTime, slot.endTime), 0
    );
  }

  getDayDuration(day: DayOfWeek): string {
    return formatDuration(this.getDayMinutes(day));
  }

  // 🆕 Helper pour le template (évite l'erreur TypeScript)
  getDayName(day: any): string {
    if (!day) return '';
    return DAYS_FR[day as DayOfWeek] || '';
  }

  // Getters formulaire
  get day() { return this.slotForm.get('day'); }
  get startTime() { return this.slotForm.get('startTime'); }
  get endTime() { return this.slotForm.get('endTime'); }
}