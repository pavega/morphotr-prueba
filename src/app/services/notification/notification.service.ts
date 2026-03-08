import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  showSuccessMessage(text: any) {
    this.clearMessage();
    this.messageService.add({
      key: 'success',
      severity: 'success',
      summary: 'Éxito!',
      detail: text,
    });
  }

  showErrorMessage(text: any) {
    this.clearMessage();
    this.messageService.add({
      key: 'error',
      severity: 'error',
      summary: 'Error',
      detail: text,
    });
  }

  showInfoMessage(text: any) {
    this.clearMessage();
    this.messageService.add({
      key: 'info',
      severity: 'info',
      summary: 'Información',
      detail: text,
    });
  }

  clearMessage() {
    this.messageService.clear();
  }
}
