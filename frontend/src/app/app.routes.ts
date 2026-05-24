import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'collaboration',
    loadComponent: () =>
      import('./features/collaboration/group-list/group-list').then(m => m.GroupListComponent)
  },
  {
    path: 'collaboration/:id',
    loadComponent: () =>
      import('./features/collaboration/group-detail/group-detail').then(m => m.GroupDetailComponent)
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./features/notifications/notification-list/notification-list').then(m => m.NotificationListComponent)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/user-list/user-list').then(m => m.UserListComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];