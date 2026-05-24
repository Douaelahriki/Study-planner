import { Component, Input, OnInit, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../core/services/message.service';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Message } from '../../../core/models/message.model';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-box.html',
  styleUrl: './chat-box.scss'
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  @Input() groupId!: string;
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  messages = signal<Message[]>([]);
  newMessage = signal('');
  loading = signal(true);
  typingUser = signal('');

  private socketSub?: Subscription;
  private typingSub?: Subscription;
  private typingTimeout?: any;

  constructor(
    private messageService: MessageService,
    private socketService: SocketService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
    this.socketService.connect();
    this.socketService.joinGroup(this.groupId);

    // Écouter nouveaux messages
    this.socketSub = this.socketService.onNewMessage().subscribe(res => {
      this.messages.update(msgs => [...msgs, res.data]);
      this.scrollToBottom();
    });

    // Écouter typing
    this.typingSub = this.socketService.onUserTyping().subscribe(data => {
      this.typingUser.set(data.name);
      setTimeout(() => this.typingUser.set(''), 2000);
    });
  }

  ngOnDestroy(): void {
    this.socketService.leaveGroup(this.groupId);
    this.socketSub?.unsubscribe();
    this.typingSub?.unsubscribe();
  }

  loadMessages(): void {
    this.messageService.getMessages(this.groupId).subscribe({
      next: (res) => {
        this.messages.set(res.data);
        this.loading.set(false);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => this.loading.set(false)
    });
  }

  sendMessage(): void {
    const content = this.newMessage().trim();
    if (!content) return;

    this.socketService.sendMessage(this.groupId, content);
    this.newMessage.set('');
    this.socketService.emitStopTyping(this.groupId);
  }

  onTyping(): void {
    this.socketService.emitTyping(this.groupId);
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.socketService.emitStopTyping(this.groupId);
    }, 1500);
  }

  onKeyEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isMyMessage(msg: Message): boolean {
    return msg.senderId._id === this.authService.currentUser()?._id;
  }

  private scrollToBottom(): void {
    try {
      this.messagesEnd?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }
} 