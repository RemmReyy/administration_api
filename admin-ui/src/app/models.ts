export interface Salesman {
  sid: number;
  firstname: string;
  lastname: string;
  department?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
}

export interface PerformanceRecord {
  goalId: number;
  goalDescription: string;
  valueSupervisor: number;
  valuePeerGroup: number;
  year: number;
}

export interface OpenPerformance {
  salesmanId: string;
  year: number;
  totalRevenue: number;
  servedClients: string[];
}

export interface Product {
  id: string;
  productNumber: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  name: string;
  amount: number;
  currency: string;
  createdAt: string;
  salesRepId: string;
  customerId: string;
  status: string;
}

export interface Company {
  id: string;
  companyName: string;
  fullAddress?: string;
  rating?: string;
  industry?: string;
}

export interface Employee {
  id: string;
  fullName: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
}

export interface BonusPayload {
  year: number;
  value: number;
}

