import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  isCollapsed = signal(false);

  constructor(public authService: AuthService) {}

  get navItems() {
  if (this.authService.isAdmin()) {
    return [
      { label: 'Administration', icon: '⚙️', route: '/admin' },
      { label: 'Notifications',  icon: '🔔', route: '/notifications' },
    ];
  }
  return [
    { label: 'Planning',      icon: '📅', route: '/planning' },
    { label: 'Collaboration', icon: '👥', route: '/collaboration' },
    { label: 'Notifications', icon: '🔔', route: '/notifications' },
  ];
}

  toggleSidebar(): void {
    this.isCollapsed.update(v => !v);
  }
}