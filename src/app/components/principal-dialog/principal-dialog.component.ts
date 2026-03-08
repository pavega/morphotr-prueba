import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PRIMENG_MODULES } from '../../utils/primeng.config';

@Component({
  selector: 'app-principal-dialog',
  standalone: true,
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './principal-dialog.component.html',
  styleUrl: './principal-dialog.component.scss',
})
export class PrincipalDialogComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() width = '31.25rem';
  @Input() closable = true;

  @Output() visibleChange = new EventEmitter<boolean>();

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
