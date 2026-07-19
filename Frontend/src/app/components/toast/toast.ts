import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
})
export class Toast {
  constructor(readonly notification: NotificationService) {}

  trackByFn(_index: number, toast: { id: number }): number {
    return toast.id;
  }
}
