// lib/types.ts

export type Customer = {
  id: number;
  name: string;
  phone?: string;
  address?: string;
};

export interface Order {
  id: number;
  customer: Customer;
  service: string;
  weight: number;
  price: number;
  status: "pending" | "in-progress" | "completed" | "picked-up";
  payment: "unpaid" | "partial" | "paid";
  createdAt: string; // <-- tambahkan ini
}
;

export interface Service {
  id: number;
  name: string;
  price: number;
}
