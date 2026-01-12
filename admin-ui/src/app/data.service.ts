import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  BonusPayload,
  Company,
  Employee,
  OpenPerformance,
  Order,
  PerformanceRecord,
  Product,
  Salesman,
} from './models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly useMocks = true;
  private readonly salesmen$ = new BehaviorSubject<Salesman[]>([
    { sid: 1, firstname: 'Alice', lastname: 'Johnson', jobTitle: 'Sales Executive', email: 'alice@example.com' },
    { sid: 2, firstname: 'Bob', lastname: 'Smith', jobTitle: 'Sales Manager', email: 'bob@example.com' },
  ]);
  private readonly performance$ = new BehaviorSubject<PerformanceRecord[]>([
    { goalId: 1, goalDescription: 'Q1 pipeline growth', valueSupervisor: 4.5, valuePeerGroup: 4.2, year: 2025 },
    { goalId: 1, goalDescription: 'Customer NPS', valueSupervisor: 4.7, valuePeerGroup: 4.6, year: 2025 },
    { goalId: 2, goalDescription: 'Upsell initiatives', valueSupervisor: 4.1, valuePeerGroup: 3.9, year: 2025 },
  ]);
  private readonly openPerformance$ = new BehaviorSubject<OpenPerformance[]>([
    { salesmanId: '1', year: 2025, totalRevenue: 125000, servedClients: ['c1', 'c2', 'c3'] },
    { salesmanId: '2', year: 2025, totalRevenue: 98000, servedClients: ['c2', 'c4'] },
    { salesmanId: '3', year: 2025, totalRevenue: 143000, servedClients: ['c5', 'c6', 'c7', 'c1'] },
  ]);
  private readonly products$ = new BehaviorSubject<Product[]>([
    { id: 'p1', productNumber: 'PR-001', name: 'CRM License', price: 1200, active: true },
    { id: 'p2', productNumber: 'PR-002', name: 'Support Plan', price: 500, active: true },
  ]);
  private readonly orders$ = new BehaviorSubject<Order[]>([
    { id: 'o1', orderNumber: 'SO-1001', name: 'ACME Renewal', amount: 25000, currency: 'USD', createdAt: new Date().toISOString(), salesRepId: '1', customerId: 'c1', status: 'OPEN' },
    { id: 'o2', orderNumber: 'SO-1002', name: 'New Logo', amount: 40000, currency: 'USD', createdAt: new Date().toISOString(), salesRepId: '2', customerId: 'c4', status: 'OPEN' },
  ]);
  private readonly companies$ = new BehaviorSubject<Company[]>([
    { id: 'c1', companyName: 'ACME Corp', fullAddress: 'NY, 5th Avenue', rating: 'Excellent', industry: 'Manufacturing' },
    { id: 'c2', companyName: 'Globex', fullAddress: 'LA, Sunset Blvd', rating: 'Very good', industry: 'Tech' },
  ]);

  constructor(private readonly api: ApiService) {}

  // Salesmen
  listSalesmen(): Observable<Salesman[]> {
    if (this.useMocks) return this.salesmen$.asObservable();
    return this.api.listSalesmen();
  }

  createSalesman(payload: Partial<Salesman>): Observable<Salesman> {
    if (this.useMocks) {
      const next: Salesman = {
        sid: Number(payload.sid),
        firstname: payload.firstname || '',
        lastname: payload.lastname || '',
        department: payload.department,
        jobTitle: payload.jobTitle,
        email: payload.email,
        phone: payload.phone,
      };
      this.salesmen$.next([...this.salesmen$.value, next]);
      return of(next);
    }
    return this.api.createSalesman(payload);
  }

  deleteSalesman(sid: number): Observable<void> {
    if (this.useMocks) {
      this.salesmen$.next(this.salesmen$.value.filter(s => s.sid !== sid));
      this.performance$.next(this.performance$.value.filter(p => p.goalId !== sid));
      return of(void 0);
    }
    return this.api.deleteSalesman(sid);
  }

  // Performance
  listPerformanceBySalesman(sid: number): Observable<PerformanceRecord[]> {
    if (this.useMocks) return of(this.performance$.value.filter(p => p.goalId === sid));
    return this.api.listPerformanceBySalesman(sid);
  }

  listPerformanceBySalesmanYear(sid: number, year: number): Observable<PerformanceRecord[]> {
    if (this.useMocks) return of(this.performance$.value.filter(p => p.goalId === sid && p.year === year));
    return this.api.listPerformanceBySalesmanYear(sid, year);
  }

  createPerformance(payload: PerformanceRecord): Observable<PerformanceRecord> {
    if (this.useMocks) {
      const record: PerformanceRecord = { ...payload, goalId: Number(payload.goalId), year: Number(payload.year) };
      this.performance$.next([...this.performance$.value, record]);
      return of(record);
    }
    return this.api.createPerformance(payload);
  }

  updatePerformance(payload: { sid: number; description: string; newValueSupervisor: number; newValuePeerGroup: number }): Observable<PerformanceRecord> {
    if (this.useMocks) {
      const next = this.performance$.value.map(p => {
        if (p.goalId === payload.sid && p.goalDescription === payload.description) {
          return { ...p, valueSupervisor: payload.newValueSupervisor, valuePeerGroup: payload.newValuePeerGroup };
        }
        return p;
      });
      this.performance$.next(next);
      const updated = next.find(p => p.goalId === payload.sid && p.goalDescription === payload.description)!;
      return of(updated);
    }
    return this.api.updatePerformance(payload);
  }

  deletePerformance(payload: { sid: number; description: string }): Observable<void> {
    if (this.useMocks) {
      this.performance$.next(
        this.performance$.value.filter(p => !(p.goalId === payload.sid && p.goalDescription === payload.description))
      );
      return of(void 0);
    }
    return this.api.deletePerformance(payload);
  }

  // OpenCRX
  listOpenSalesmen(): Observable<Salesman[]> {
    if (this.useMocks) return this.salesmen$.asObservable();
    return this.api.listOpenSalesmen();
  }

  getOpenPerformance(year: number): Observable<OpenPerformance[]> {
    if (this.useMocks) return of(this.openPerformance$.value.filter(p => p.year === year));
    return this.api.getOpenPerformance(year);
  }

  listProducts(): Observable<Product[]> {
    if (this.useMocks) return this.products$.asObservable();
    return this.api.listProducts();
  }

  listOrders(): Observable<Order[]> {
    if (this.useMocks) return this.orders$.asObservable();
    return this.api.listOrders();
  }

  listCompanies(): Observable<Company[]> {
    if (this.useMocks) return this.companies$.asObservable();
    return this.api.listCompanies();
  }

  // Orange HRM
  getEmployee(id: string): Observable<Employee> {
    if (this.useMocks) return of({ id, fullName: 'Demo Employee', jobTitle: 'Sales', email: 'demo@acme.com' });
    return this.api.getEmployee(id);
  }

  addBonus(id: string, payload: BonusPayload): Observable<{ success: boolean }> {
    if (this.useMocks) return of({ success: true });
    return this.api.addBonus(id, payload);
  }
}

