import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrincipalDataViewComponent } from '../../components/principal-data-view/principal-data-view.component';
import { PrincipalDialogComponent } from '../../components/principal-dialog/principal-dialog.component';
import { PrincipalTableComponent } from '../../components/principal-table/principal-table.component';
import { PRIMENG_MODULES } from '../../utils/primeng.config';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceService } from '../../services/invoice/invoice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../services/notification/notification.service';
import { EmptyComponent } from '../../components/empty/empty.component';
import { getError, isInvalid } from '../../helpers/form-helper';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    CommonModule,
    PrincipalTableComponent,
    PrincipalDialogComponent,
    ReactiveFormsModule,
    PRIMENG_MODULES,
    PrincipalDataViewComponent,
    CreateInvoiceComponent,
    EmptyComponent,
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit {
  @ViewChild('productDataView') productDataView!: any;
  lineDialogVisible = false;
  productDialogVisible = false;
  invoiceDetailForm!: FormGroup;
  invoiceDetails = signal<any[]>([]);
  items = signal<any[]>([]);
  multiselect = signal<'single' | 'multiple'>('single');

  invoiceNumber: string = '';
  productCode: string = '';

  columns = [
    { field: 'code', header: 'SKU' },
    { field: 'description', header: 'Producto' },
    { field: 'quantity', header: 'Cantidad' },
    { field: 'price', header: 'Precio' },
    { field: 'total', header: 'Total' },
  ];

  constructor(
    private invoiceService: InvoiceService,
    private fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private notificationService: NotificationService,
  ) {
    this.buildInvoiceDetailForm();
  }

  ngOnInit(): void {}

  buildInvoiceDetailForm() {
    this.invoiceDetailForm = this.fb.group({
      product: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantity: [1, [Validators.required]],
    });
  }

  openLineDialog() {
    if (!this.invoiceNumber) {
      this.notificationService.showInfoMessage('Debes crear una factura');
      return;
    }
    this.lineDialogVisible = true;
  }

  getInvoiceDetails(invoiceNumber: any) {
    this.invoiceNumber = invoiceNumber;

    if (!invoiceNumber) {
      this.invoiceDetails.set([]);
      return;
    }

    this.getInvoice(invoiceNumber);
  }

  getInvoice(number: any) {
    this.invoiceService.getInvoice(number).subscribe({
      next: (resp) => {
        const arr = resp.DETALLES.map((item: any) => ({
          line: item.LINEA,
          code: item.CODIGO_ARTICULO,
          description: item.ARTICULO,
          quantity: item.CANTIDAD,
          price: item.PRECIO,
          total: item.TOTAL_LINEA,
        }));
        this.invoiceDetails.set(arr);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  openProductDialog() {
    this.productDialogVisible = true;
    this.getProduct();
  }

  getProduct() {
    const product = this.invoiceDetailForm.value.description ?? '';

    const invoiceCodes = this.invoiceDetails().map((item) => item.code);

    this.invoiceService.getProduct(product).subscribe({
      next: (resp) => {
        const arr = resp.PRODUCTOS.map((item: any) => ({
          id: item.CODIGO_ARTICULO,
          code: item.CODIGO_ARTICULO,
          label: item.DESCRIPCION,
        })).filter((item: any) => !invoiceCodes.includes(item.code));
        this.items.set(arr);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  async onSelectedItem(data: any) {
    const product = data.selected[0];
    this.productDialogVisible = false;
    this.invoiceDetailForm.controls['product'].setValue(product);
    this.invoiceDetailForm.controls['description'].setValue(product.label);
  }

  createLineDetail() {
    if (this.invoiceDetailForm.invalid) return;

    const payload = {
      invoiceNumber: this.invoiceNumber,
      code: this.invoiceDetailForm.value.product.code,
      quantity: this.invoiceDetailForm.value.quantity,
    };

    this.spinnerService.show();
    this.invoiceService
      .postInvoiceDetail(payload.invoiceNumber, payload.code, payload.quantity)
      .subscribe({
        next: (resp) => {
          this.notificationService.showSuccessMessage(resp.ALERTA);
          this.getInvoice(this.invoiceNumber);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error en la solicitud:', err);
        },
        complete: () => {
          this.spinnerService.hide();
        },
      });
  }

  deleteInvoiceDetail(row: any) {
    this.spinnerService.show();
    this.invoiceService
      .deleteInvoiceDetail(this.invoiceNumber, row.line)
      .subscribe({
        next: (resp) => {
          this.notificationService.showSuccessMessage(resp.ALERTA);
          this.getInvoice(this.invoiceNumber);
        },
        error: (err) => {
          console.error('Error en la solicitud:', err);
        },
        complete: () => {
          this.spinnerService.hide();
        },
      });
  }

  closeLineDialog() {
    this.lineDialogVisible = false;
    this.resetForm();
  }

  handleClose(event: any) {
    if (!event) {
      this.productDataView?.close();
    }
  }

  resetForm() {
    this.lineDialogVisible = false;
    this.invoiceDetailForm.reset();
    this.invoiceDetailForm.controls['product'].setValue(null);
    this.invoiceDetailForm.controls['description'].setValue('');
    this.invoiceDetailForm.controls['quantity'].setValue(1);
  }

  getTotal(): number {
    return this.invoiceDetails().reduce(
      (sum, item) => sum + Number(item.total),
      0,
    );
  }

  isInvalid(field: string): boolean {
    return isInvalid(this.invoiceDetailForm, field);
  }

  getError(field: string): string {
    return getError(this.invoiceDetailForm, field);
  }
}
