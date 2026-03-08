import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PRIMENG_MODULES } from '../../utils/primeng.config';

@Component({
  selector: 'app-principal-table',
  standalone: true,
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './principal-table.component.html',
  styleUrl: './principal-table.component.scss',
})
export class PrincipalTableComponent {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() showActions = true;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
}
