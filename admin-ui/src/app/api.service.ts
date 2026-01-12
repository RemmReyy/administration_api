import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  Salesman,
  PerformanceRecord,
  OpenPerformance,
  Product,
  Order,
  Company,
  Employee,
  BonusPayload,
} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:3001';

  // Salesmen CRUD
  listSalesmen(): Observable<Salesman[]> {
    return this.http.get<Salesman[]>(`${this.base}/api/salesmen`).pipe(catchError(this.handle));
  }

  getSalesman(sid: number): Observable<Salesman> {
    return this.http.get<Salesman>(`${this.base}/api/salesmen/${sid}`).pipe(catchError(this.handle));
  }

  createSalesman(payload: Partial<Salesman>): Observable<Salesman> {
    return this.http.post<Salesman>(`${this.base}/api/salesmen`, payload).pipe(catchError(this.handle));
  }

  deleteSalesman(sid: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/salesmen/${sid}`).pipe(catchError(this.handle));
  }

  // Performance CRUD
  listPerformanceBySalesman(sid: number): Observable<PerformanceRecord[]> {
    return this.http
      .get<PerformanceRecord[]>(`${this.base}/api/performance/salesman/${sid}`)
      .pipe(catchError(this.handle));
  }

  listPerformanceBySalesmanYear(sid: number, year: number): Observable<PerformanceRecord[]> {
    return this.http
      .get<PerformanceRecord[]>(`${this.base}/api/performance/salesman/${sid}/year/${year}`)
      .pipe(catchError(this.handle));
  }

  createPerformance(payload: PerformanceRecord): Observable<PerformanceRecord> {
    return this.http.post<PerformanceRecord>(`${this.base}/api/performance`, payload).pipe(catchError(this.handle));
  }

  updatePerformance(payload: { sid: number; description: string; newValueSupervisor: number; newValuePeerGroup: number }): Observable<PerformanceRecord> {
    return this.http.put<PerformanceRecord>(`${this.base}/api/performance`, payload).pipe(catchError(this.handle));
  }

  deletePerformance(payload: { sid: number; description: string }): Observable<void> {
    return this.http
      .request<void>('delete', `${this.base}/api/performance`, { body: payload })
      .pipe(catchError(this.handle));
  }

  // OpenCRX dashboards
  listOpenSalesmen(): Observable<Salesman[]> {
    return this.http.get<Salesman[]>(`${this.base}/api/open/salesmen`).pipe(catchError(this.handle));
  }

  getOpenSalesman(id: string): Observable<Salesman> {
    return this.http.get<Salesman>(`${this.base}/api/open/salesmen/${id}`).pipe(catchError(this.handle));
  }

  getOpenPerformance(year: number): Observable<OpenPerformance[]> {
    return this.http.get<OpenPerformance[]>(`${this.base}/api/open/performance/${year}`).pipe(catchError(this.handle));
  }

  getOpenPerformanceById(year: number, id: string): Observable<OpenPerformance[]> {
    return this.http
      .get<OpenPerformance[]>(`${this.base}/api/open/performance/${year}/${id}`)
      .pipe(catchError(this.handle));
  }

  listProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/api/open/products`).pipe(catchError(this.handle));
  }

  listOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/api/open/orders`).pipe(catchError(this.handle));
  }

  listOrdersBySalesman(sid: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/api/open/orders/salesmen/${sid}`).pipe(catchError(this.handle));
  }

  listCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.base}/api/open/companies`).pipe(catchError(this.handle));
  }

  // OrangeHRM
  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.base}/api/orange/employees/${id}`).pipe(catchError(this.handle));
  }

  addBonus(id: string, payload: BonusPayload): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${this.base}/api/orange/employees/${id}/bonus`, payload)
      .pipe(catchError(this.handle));
  }

  private handle(error: HttpErrorResponse) {
    console.error('API error', error);
    return throwError(() => error);
  }
}

