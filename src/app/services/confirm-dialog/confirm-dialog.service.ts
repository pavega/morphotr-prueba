import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrincipalConfirmDialogComponent } from '../../components/principal-confirm-dialog/principal-confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  ref: DynamicDialogRef | undefined;

  constructor(private dialogService: DialogService) {}

  openConfirmDialog(options: {
    header?: string;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    icon?: string;
    styleClass?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      this.ref = this.dialogService.open(PrincipalConfirmDialogComponent, {
        header: options.header || '',
        width: '35rem',
        styleClass: `principal-confirm-dialog ${options.styleClass ?? ''}`,
        data: {
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel ?? 'Confirmar',
          cancelLabel: options.cancelLabel ?? 'Cancelar',
          icon: options.icon ?? 'pi pi-question-circle',
        },
      });

      this.ref.onClose.subscribe((result) => {
        resolve(result);
      });
    });
  }

  close() {
    this.ref?.close();
  }
}
