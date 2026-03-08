import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PRIMENG_MODULES } from '../../../utils/primeng.config';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InvoiceService } from '../../../services/invoice/invoice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../../services/notification/notification.service';
import { getError, isInvalid } from '../../../helpers/form-helper';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [CommonModule, PRIMENG_MODULES, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.scss',
})
export class CreateInvoiceComponent {
  invoiceForm!: FormGroup;
  saveButtonDisable: boolean = false;

  @Output() save = new EventEmitter<any>();

  constructor(
    private invoiceService: InvoiceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    private notificationService: NotificationService,
  ) {
    this.buildInvoiceForm();
  }

  ngOnInit(): void {}

  buildInvoiceForm() {
    this.invoiceForm = this.fb.group({
      number: [{ value: '', disabled: false }, Validators.required],
      date: [{ value: new Date(), disabled: false }, Validators.required],
    });
  }

  createInvoice() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const { number, date } = this.invoiceForm.value;

    const payload = {
      number: number,
      date: this.datePipe.transform(date, 'yyyy-MM-dd'),
    };

    this.spinnerService.show();
    this.invoiceService.postInvoice(payload.number, payload.date!).subscribe({
      next: (resp) => {
        this.notificationService.showSuccessMessage(resp.ALERTA);
        this.disableForm(payload);
        this.emitInvoice(resp.NUMERO_FACTURA);
      },
      error: (err) => {
        this.notificationService.showErrorMessage('Error en la solicitud');
        this.spinnerService.hide();
        console.error('Error', err);
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  emitInvoice(invoiceNumber: string | null) {
    this.save.emit(invoiceNumber);
  }

  disableForm(data: any) {
    const localDate = new Date(data.date + 'T00:00:00');
    this.saveButtonDisable = true;
    this.invoiceForm.controls['number'].setValue(data.number);
    this.invoiceForm.controls['date'].setValue(localDate);

    this.invoiceForm.controls['number'].disable();
    this.invoiceForm.controls['date'].disable();
  }

  newInvoice() {
    this.saveButtonDisable = false;
    this.invoiceForm.reset();
    this.invoiceForm.controls['number'].setValue('');
    this.invoiceForm.controls['date'].setValue(new Date());

    this.invoiceForm.controls['number'].enable();
    this.invoiceForm.controls['date'].enable();

    this.emitInvoice(null);
  }

  isInvalid(field: string): boolean {
    return isInvalid(this.invoiceForm, field);
  }

  getError(field: string): string {
    return getError(this.invoiceForm, field);
  }
}
