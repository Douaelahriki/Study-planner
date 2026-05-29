import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatsService } from '../../core/services/stats.service';
import { AuthService } from '../../core/services/auth.service';
import { StatsSummary, SubjectStat, DayStat } from '../../core/models/stats.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  summary = signal<StatsSummary | null>(null);
  subjectStats = signal<SubjectStat[]>([]);
  weeklyStats = signal<DayStat[]>([]);
  loading = signal(true);
  showStats = signal(false);

  quickActions = [
    { label: 'Matières',       icon: '📚', subtitle: 'Mes matières',    route: '/subjects',      highlight: false },
    { label: 'Disponibilités', icon: '📅', subtitle: 'Créneaux libres', route: '/availability',  highlight: false },
    { label: 'Sessions',       icon: '🗓️', subtitle: 'Mes sessions',    route: '/sessions',      highlight: false },
    { label: 'Planning Auto',  icon: '🤖', subtitle: 'Génération IA',   route: '/planning/auto', highlight: true  },
  ];

  quickLinks = [
    { label: 'Collaboration', icon: '👥', subtitle: 'Mes groupes',       route: '/collaboration' },
    { label: 'Notifications', icon: '🔔', subtitle: 'Mes notifications', route: '/notifications' },
  ];

  adminLinks = [
    { label: 'Utilisateurs',  icon: '👥', subtitle: 'Gestion users',    route: '/admin/users' },
    { label: 'Ajouter Admin', icon: '➕', subtitle: 'Créer compte',     route: '/admin/new-admin' },
    { label: 'Statistiques',  icon: '📊', subtitle: 'Vue globale',      route: '/admin/stats' },
  ];

  constructor(
    private statsService: StatsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.loading.set(true);
    this.statsService.getSummary().subscribe(res => this.summary.set(res.data));
    this.statsService.getBySubject().subscribe(res => this.subjectStats.set(res.data));
    this.statsService.getWeekly().subscribe(res => {
      this.weeklyStats.set(res.data);
      this.loading.set(false);
    });
  }

  toggleStats(): void {
    this.showStats.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  getMaxHours(): number {
    return Math.max(...this.weeklyStats().map(d => d.hours), 1);
  }

  getBarHeight(hours: number): number {
    return Math.round((hours / this.getMaxHours()) * 100);
  }
  
}