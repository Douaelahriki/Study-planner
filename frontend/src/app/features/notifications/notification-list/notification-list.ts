import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { GroupService } from '../../../core/services/group.service';
import { Notification } from '../../../core/models/notification.model';
import { RouterModule } from '@angular/router';









@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss'
})
export class NotificationListComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  loading = signal(true);

  constructor(
    public notificationService: NotificationService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading.set(true);
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.notifications.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
respondedInvitations = signal<Set<string>>(new Set());
  respondInvitation(groupId: string, status: 'accepted' | 'refused', notifId: string): void {
  this.groupService.respondInvitation(groupId, status).subscribe({
    next: () => {
      // Ajouter l'id dans le set → boutons disparaissent
      this.respondedInvitations.update(set => {
        const newSet = new Set(set);
        newSet.add(notifId);
        return newSet;
      });
      this.markRead(notifId);
      if (status === 'accepted') {
        alert('✅ Vous avez rejoint le groupe !');
      }
    },
    error: (err) => alert(err.error?.message || 'Erreur')
  });
}

  markRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.notifications.update(notifs =>
        notifs.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    });
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.update(notifs =>
        notifs.map(n => ({ ...n, isRead: true }))
      );
    });
  }

  deleteNotif(id: string): void {
    this.notificationService.deleteNotification(id).subscribe(() => {
      this.notifications.update(notifs => notifs.filter(n => n._id !== id));
    });
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      invitation: '👥',
      reminder: '⏰',
      goal_reached: '🎯',
      session_completed: '✅',
      group_message: '💬'
    };
    return icons[type] || '🔔';
  }
}