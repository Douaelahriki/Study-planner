import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {
  showNotifications = signal(false);
  notifications = signal<any[]>([]);

  constructor(
    public authService: AuthService,
    public notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(res => {
      this.notifications.set(res.data);
    });
  }

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    if (this.showNotifications()) {
      this.loadNotifications();
    }
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.update(notifs =>
        notifs.map(n => ({ ...n, isRead: true }))
      );
    });
  }

  markRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.notifications.update(notifs =>
        notifs.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    });
  }

  logout(): void {
    this.authService.logout();
  }
} 