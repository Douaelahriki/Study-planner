import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../core/models/group.model';
import { GroupFormComponent } from '../group-form/group-form';
@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, RouterModule, GroupFormComponent],
  templateUrl: './group-list.html',
  styleUrl: './group-list.scss'
})
export class GroupListComponent implements OnInit {
  groups = signal<Group[]>([]);
  loading = signal(true);
  showForm = signal(false);

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.loading.set(true);
    this.groupService.getMyGroups().subscribe({
      next: (res) => {
        this.groups.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
  }

  onGroupCreated(): void {
    this.showForm.set(false);
    this.loadGroups();
  }

  deleteGroup(id: string): void {
    if (!confirm('Supprimer ce groupe ?')) return;
    this.groupService.deleteGroup(id).subscribe(() => this.loadGroups());
  }
} 