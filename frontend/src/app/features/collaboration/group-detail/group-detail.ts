import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../core/models/group.model';
import { ChatBoxComponent } from '../chat-box/chat-box';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatBoxComponent],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.scss'
})
export class GroupDetailComponent implements OnInit {
  group = signal<Group | null>(null);
  loading = signal(true);
  inviteEmail = signal('');
  inviteError = signal('');
  inviteSuccess = signal('');
  activeTab = signal<'chat' | 'members' | 'invite'>('chat');
  groupId = signal('');

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.groupId.set(id);
    this.loadGroup(id);
  }

  loadGroup(id: string): void {
    this.loading.set(true);
    this.groupService.getGroupById(id).subscribe({
      next: (res) => {
        this.group.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  inviteMember(): void {
    if (!this.inviteEmail().trim()) return;
    this.inviteError.set('');
    this.inviteSuccess.set('');

    this.groupService.inviteMember(this.groupId(), this.inviteEmail()).subscribe({
      next: () => {
        this.inviteSuccess.set('Invitation envoyée !');
        this.inviteEmail.set('');
      },
      error: (err) => {
        this.inviteError.set(err.error?.message || 'Erreur lors de l\'invitation');
      }
    });
  }

  setTab(tab: 'chat' | 'members' | 'invite'): void {
    this.activeTab.set(tab);
  }
} 