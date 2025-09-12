// lib/types.ts

export type Customer = {
  id: number;
  name: string;
  phone?: string;
  address?: string;
};

export type Order = {
  id: number;
  customer: Customer;
  weight: number;
  service: string;
  price: number;
  status: string;
  payment: string;
};

export interface Service {
  id: number;
  name: string;
  price: number;
}
