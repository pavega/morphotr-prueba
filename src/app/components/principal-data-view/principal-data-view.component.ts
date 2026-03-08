import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  Signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PRIMENG_MODULES } from '../../utils/primeng.config';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-principal-data-view',
  standalone: true,
  imports: [CommonModule, PRIMENG_MODULES, FormsModule],
  templateUrl: './principal-data-view.component.html',
  styleUrl: './principal-data-view.component.scss',
})
export class PrincipalDataViewComponent implements AfterViewInit, OnChanges {
  @ViewChild('dataView') dataView!: any;

  @Input({ required: true }) items!: Signal<any[]>;
  @Input({ required: true }) selectionMode!: Signal<'single' | 'multiple'>;

  @Output() onConfirmSelection = new EventEmitter<any>();

  currentSelection = signal<any[]>([]);
  searchTerm = signal('');

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const all = this.items() ?? [];
    if (!term) return all;
    return all.filter(
      (item) =>
        item.label?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.serie?.toLowerCase().includes(term),
    );
  });

  constructor(private notificationService: NotificationService) {
    // actulizar paginacion en la busqueda
    effect(() => {
      const _ = this.searchTerm();
      setTimeout(() => this.resetPagination(), 0);
    });
  }

  // resetear paginacion cuando se monta el componente
  ngAfterViewInit(): void {
    queueMicrotask(() => this.resetPagination());
  }

  // resetear paginacion cuando cambia la lista
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      queueMicrotask(() => this.resetPagination());
    }
  }

  isChecked(item: any): boolean {
    return this.currentSelection().some((sel) => sel.id === item.id);
  }

  toggleSelection(item: any): void {
    const mode = this.selectionMode();
    const current = this.currentSelection();

    if (mode === 'single') {
      const isSelected = current.some((sel) => sel.id === item.id);
      this.currentSelection.set(isSelected ? [] : [item]);
      this.confirmSelection();
    } else {
      const exists = current.some((sel) => sel.id === item.id);
      this.currentSelection.set(
        exists
          ? current.filter((sel) => sel.id !== item.id)
          : [...current, item],
      );
    }
  }

  // emitir datos seleccionados
  confirmSelection(): void {
    const selected = this.currentSelection();

    if (selected.length <= 0) {
      this.notificationService.showInfoMessage(
        'Debes seleccionar alguna opción',
      );
      return;
    }

    this.onConfirmSelection.emit({ selected });

    this.close();
  }

  close() {
    this.currentSelection.set([]);
    this.searchTerm.set('');

    // resetear al volver a montarse
    queueMicrotask(() => this.resetPagination());
  }

  resetPagination() {
    if (!this.dataView) return;

    setTimeout(() => {
      this.dataView.first = 0;
    }, 0);
  }
}
