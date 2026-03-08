import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = environment.apiUrl;
  private token = environment.token;

  constructor(private http: HttpClient) {}

  getInvoice(invoiceNumer: string): Observable<any> {
    const params = new HttpParams()
      .set('method', 'ObtieneFactura')
      .set('token', this.token)
      .set('numero_factura', invoiceNumer);

    return this.http.get<any>(this.apiUrl, { params });
  }

  postInvoice(invoiceNumer: number, date: string): Observable<any> {
    const params = new HttpParams()
      .set('method', 'CreaFactura')
      .set('token', this.token)
      .set('numero_factura', invoiceNumer)
      .set('fecha', date);

    return this.http.post<any>(this.apiUrl, null, { params });
  }

  getProduct(product: string): Observable<any> {
    const params = new HttpParams()
      .set('method', 'BuscarProducto')
      .set('token', this.token)
      .set('producto', product);

    return this.http.get<any>(this.apiUrl, { params });
  }

  postInvoiceDetail(
    invoiceNumber: string,
    code: string,
    quantity: number,
  ): Observable<any> {
    const params = new HttpParams()
      .set('method', 'AgregaDetalle')
      .set('token', this.token)
      .set('numero_factura', invoiceNumber)
      .set('codigo_articulo', code)
      .set('cantidad', quantity);

    return this.http.post<any>(this.apiUrl, null, { params });
  }

  deleteInvoiceDetail(invoiceNumer: string, line: string): Observable<any> {
    const params = new HttpParams()
      .set('method', 'BorrarDetalle')
      .set('token', this.token)
      .set('numero_factura', invoiceNumer)
      .set('linea', line);

    return this.http.post<any>(this.apiUrl, null, { params });
  }
}
