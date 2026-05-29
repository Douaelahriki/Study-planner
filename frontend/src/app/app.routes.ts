import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [

  // ── Routes publiques ──────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // ── Dashboard ─────────────────────────────
  {
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
},

  // ── Subjects (binome) ─────────────────────
  {
    path: 'subjects',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/subjects/subject-list/subject-list.component').then(m => m.SubjectListComponent)
  },
  {
    path: 'subjects/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/subjects/subject-form/subject-form.component').then(m => m.SubjectFormComponent)
  },
  {
    path: 'subjects/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/subjects/subject-form/subject-form.component').then(m => m.SubjectFormComponent)
  },

  // ── Availability (binome) ─────────────────
  {
    path: 'availability',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/availability/availability-form/availability-form.component').then(m => m.AvailabilityFormComponent)
  },

  // ── Sessions (binome) ─────────────────────
  {
    path: 'sessions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/session-list/session-list.component').then(m => m.SessionListComponent)
  },
  {
    path: 'sessions/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/session-form/session-form.component').then(m => m.SessionFormComponent)
  },
  {
    path: 'sessions/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sessions/session-form/session-form.component').then(m => m.SessionFormComponent)
  },

  // ── Planning Auto (binome) ────────────────
  {
    path: 'planning/auto',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/planning/auto-planning/auto-planning.component').then(m => m.AutoPlanningComponent)
  },

  // ── Admin (binome) ────────────────────────
  {
    path: 'admin/users',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/user-list/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'admin/users/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/user-detail/user-detail.component').then(m => m.UserDetailComponent)
  },
  {
    path: 'admin/new-admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-form/admin-form.component').then(m => m.AdminFormComponent)
  },
  {
    path: 'admin/stats',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/global-stats/global-stats.component').then(m => m.GlobalStatsComponent)
  },

  // ── Collaboration (Douae) ─────────────────
  {
    path: 'collaboration',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/collaboration/group-list/group-list').then(m => m.GroupListComponent)
  },
  {
    path: 'collaboration/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/collaboration/group-detail/group-detail').then(m => m.GroupDetailComponent)
  },

  // ── Notifications (Douae) ─────────────────
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/notifications/notification-list/notification-list').then(m => m.NotificationListComponent)
  },

  // ── Redirections ──────────────────────────
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];