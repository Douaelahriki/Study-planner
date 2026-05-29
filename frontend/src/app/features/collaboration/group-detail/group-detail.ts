import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../core/services/group.service';
import { GroupSessionService } from '../../../core/services/group-session.service';
import { Group } from '../../../core/models/group.model';
import { GroupSession } from '../../../core/models/group-session.model';
import { ChatBoxComponent } from '../chat-box/chat-box';
import { SessionShareComponent } from '../session-share/session-share';
import { SessionCardComponent } from '../session-card/session-card';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatBoxComponent, SessionShareComponent, SessionCardComponent],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.scss'
})
export class GroupDetailComponent implements OnInit {
  group = signal<Group | null>(null);
  sessions = signal<GroupSession[]>([]);
  loading = signal(true);
  inviteEmail = signal('');
  inviteError = signal('');
  inviteSuccess = signal('');
  activeTab = signal<'chat' | 'sessions' | 'members' | 'invite'>('chat');
  groupId = signal('');
  showShareForm = signal(false);

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private groupSessionService: GroupSessionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.groupId.set(id);
    this.loadGroup(id);
    this.loadSessions(id);
  }

  loadGroup(id: string): void {
    this.loading.set(true);
    this.groupService.getGroupById(id).subscribe({
      next: (res) => { this.group.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  loadSessions(id: string): void {
    this.groupSessionService.getGroupSessions(id).subscribe({
      next: (res) => this.sessions.set(res.data)
    });
  }

  onSessionShared(session: GroupSession): void {
    this.sessions.update(s => [session, ...s]);
    this.showShareForm.set(false);
  }

  onSessionUpdated(updated: GroupSession): void {
    this.sessions.update(sessions =>
      sessions.map(s => s._id === updated._id ? updated : s)
    );
  }

  inviteMember(): void {
    if (!this.inviteEmail().trim()) return;
    this.inviteError.set('');
    this.inviteSuccess.set('');
    this.groupService.inviteMember(this.groupId(), this.inviteEmail()).subscribe({
      next: () => { this.inviteSuccess.set('Invitation envoyée !'); this.inviteEmail.set(''); },
      error: (err) => this.inviteError.set(err.error?.message || 'Erreur')
    });
  }

  setTab(tab: 'chat' | 'sessions' | 'members' | 'invite'): void {
    this.activeTab.set(tab);
  }
}