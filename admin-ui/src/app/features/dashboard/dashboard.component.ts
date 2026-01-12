import { AsyncPipe, NgForOf, NgIf, DecimalPipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { DataService } from '../../data.service';
import { OpenPerformance, Order, Product, Company } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [NgChartsModule, NgForOf, NgIf, AsyncPipe, DecimalPipe, CurrencyPipe]
})
export class DashboardComponent implements OnInit {
  private readonly data = inject(DataService);

  year = signal<number>(2025);
  performance = signal<OpenPerformance[]>([]);
  orders = signal<Order[]>([]);
  products = signal<Product[]>([]);
  companies = signal<Company[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  totalRevenue = computed(() => this.performance().reduce((sum, p) => sum + p.totalRevenue, 0));
  ordersCount = computed(() => this.orders().length);
  productsCount = computed(() => this.products().length);
  companiesCount = computed(() => this.companies().length);

  barData = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: this.performance().map(p => p.salesmanId),
    datasets: [
      {
        data: this.performance().map(p => p.totalRevenue),
        label: `Revenue ${this.year()}`,
        backgroundColor: '#2563eb',
        borderRadius: 6,
      },
    ],
  }));

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: '#e2e8f0' } }, x: { grid: { display: false } } },
  };

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.data.getOpenPerformance(this.year()).subscribe({
      next: perf => {
        this.performance.set(perf);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message || 'Ошибка загрузки');
        this.loading.set(false);
      },
    });
    this.data.listOrders().subscribe(o => this.orders.set(o));
    this.data.listProducts().subscribe(p => this.products.set(p));
    this.data.listCompanies().subscribe(c => this.companies.set(c));
  }
}
