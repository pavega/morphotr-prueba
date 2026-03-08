import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-principal-confirm-dialog',
  standalone: true,
  imports: [CommonModule, DynamicDialogModule],
  templateUrl: './principal-confirm-dialog.component.html',
  styleUrl: './principal-confirm-dialog.component.scss',
})
export class PrincipalConfirmDialogComponent {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  cancel() {
    this.ref.close(false);
  }

  confirm() {
    this.ref.close(true);
  }
}
