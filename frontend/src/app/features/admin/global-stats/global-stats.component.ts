import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { WeeklyDayStat } from '../../../core/models/admin.model';

@Component({
  selector: 'app-global-stats',
  imports: [CommonModule, RouterLink],
  templateUrl: './global-stats.component.html'
})
export class GlobalStatsComponent implements OnInit {
  private adminService = inject(AdminService);

  stats = signal<any>(null);
  weeklyStats = signal<WeeklyDayStat[]>([]);
  isLoading = signal(true);

  // Calcul des pourcentages pour le donut chart
  donutData = computed(() => {
    const s = this.stats();
    if (!s) return null;

    const total = s.sessions.completed + s.sessions.planned + s.sessions.missed;
    if (total === 0) return null;

    const completedPercent = (s.sessions.completed / total) * 100;
    const plannedPercent = (s.sessions.planned / total) * 100;
    const missedPercent = (s.sessions.missed / total) * 100;

    // Pour SVG donut chart (circumference = 2πr, r=70 → 439.82)
    const circumference = 439.82;
    
    return {
      total,
      completed: s.sessions.completed,
      planned: s.sessions.planned,
      missed: s.sessions.missed,
      completedDash: (completedPercent / 100) * circumference,
      plannedDash: (plannedPercent / 100) * circumference,
      missedDash: (missedPercent / 100) * circumference,
      // Offsets cumulés
      completedOffset: 0,
      missedOffset: -((completedPercent / 100) * circumference),
      plannedOffset: -(((completedPercent + missedPercent) / 100) * circumference),
      circumference
    };
  });

  // Hauteur max pour les barres
  maxHours = computed(() => {
    const max = Math.max(...this.weeklyStats().map(d => d.hours), 1);
    return max;
  });

  ngOnInit(): void {
    this.loadAllStats();
  }

  loadAllStats(): void {
    this.isLoading.set(true);

    // Charger les 2 stats en parallèle
    this.adminService.getGlobalStats().subscribe({
      next: (response) => {
        this.stats.set(response.stats);
        this.checkLoadingComplete();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });

    this.adminService.getWeeklyProductivity().subscribe({
      next: (response) => {
        this.weeklyStats.set(response.weeklyStats);
        this.checkLoadingComplete();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private loadedCount = 0;
  private checkLoadingComplete(): void {
    this.loadedCount++;
    if (this.loadedCount >= 2) {
      this.isLoading.set(false);
    }
  }

  getBarHeight(hours: number): number {
    const max = this.maxHours();
    return max > 0 ? (hours / max) * 100 : 0;
  }
}