"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Table from "@/components/ui/table";
import Button from "@/components/ui/button";
import { Order, Customer, Service } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function OrdersPage() {
  const { data: orders, error: ordersError } = useSWR<Order[]>("/api/orders", fetcher);
  const { data: customers } = useSWR<Customer[]>("/api/customers", fetcher);
  const { data: services } = useSWR<Service[]>("/api/services", fetcher);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortField, setSortField] = useState<"id" | "weight" | "price">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [addingCustomerId, setAddingCustomerId] = useState<number | "">("");
  const [addingService, setAddingService] = useState("");
  const [addingWeight, setAddingWeight] = useState<number | "">("");
  const [addingPrice, setAddingPrice] = useState<number | "">("");

  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState({
    customerId: 0,
    service: "",
    weight: 0,
    price: 0,
    status: "pending",
    payment: "unpaid",
  });

  // otomatis set harga saat service dipilih
  useEffect(() => {
    if (addingService && services) {
      const selected = services.find((s) => s.name === addingService);
      if (selected) setAddingPrice(selected.price);
    }
  }, [addingService, services]);

  if (ordersError) return <div className="text-red-500">Failed to load orders</div>;
  if (!orders || !customers || !services) return <div className="text-gray-500">Loading...</div>;

  // Filter + Search + Sort
  const filteredOrders: Order[] = orders
    .filter((o) => {
      const matchesSearch =
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.service.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? o.status === statusFilter : true;
      const matchesPayment = paymentFilter ? o.payment === paymentFilter : true;
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      const valA = sortField === "price" ? a.price : sortField === "weight" ? a.weight : a.id;
      const valB = sortField === "price" ? b.price : sortField === "weight" ? b.weight : b.id;
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

  // Add Order
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingCustomerId || !addingService || !addingWeight || !addingPrice) return;

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: addingCustomerId,
        service: addingService,
        weight: addingWeight,
        price: addingPrice,
      }),
    });

    setAddingCustomerId("");
    setAddingService("");
    setAddingWeight("");
    setAddingPrice("");
    mutate("/api/orders");
  };

  // Delete Order
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    mutate("/api/orders");
  };

  // Start Edit
  const startEdit = (o: Order) => {
    setEditingOrderId(o.id);
    setEditFields({
      customerId: o.customer.id,
      service: o.service,
      weight: o.weight,
      price: o.price,
      status: o.status,
      payment: o.payment,
    });
  };

  // Save Edit
  const handleSave = async (id: number) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editFields),
    });
    setEditingOrderId(null);
    mutate("/api/orders");
  };

  // Neon colors for glow effect
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-400 drop-shadow-[0_0_10px_yellow]";
      case "in-progress": return "text-blue-400 drop-shadow-[0_0_10px_blue]";
      case "completed": return "text-green-400 drop-shadow-[0_0_10px_green]";
      case "picked-up": return "text-purple-400 drop-shadow-[0_0_10px_purple]";
      default: return "text-white";
    }
  };

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case "unpaid": return "text-red-400 drop-shadow-[0_0_10px_red]";
      case "partial": return "text-yellow-400 drop-shadow-[0_0_10px_yellow]";
      case "paid": return "text-green-400 drop-shadow-[0_0_10px_green]";
      default: return "text-white";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_15px_cyan] mb-6">
        Orders Dashboard
      </h1>

      {/* Search / Filter / Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-end mb-6">
        <input
          type="text"
          placeholder="Search by customer or service"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md flex-1 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
          <option value="picked-up">Picked-up</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">All Payments</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as "id" | "weight" | "price")}
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="id">Sort by ID</option>
          <option value="weight">Sort by Weight</option>
          <option value="price">Sort by Price</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* Add Order Form */}
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 items-end mb-6">
        <select
          value={addingCustomerId}
          onChange={(e) => setAddingCustomerId(Number(e.target.value))}
          required
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={addingService}
          onChange={(e) => setAddingService(e.target.value)}
          required
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>{s.name} - Rp {s.price}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Weight"
          value={addingWeight}
          onChange={(e) => setAddingWeight(Number(e.target.value))}
          required
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="number"
          placeholder="Price"
          value={addingPrice}
          readOnly
          className="border px-3 py-2 rounded-md bg-gray-700 text-gray-300 cursor-not-allowed"
        />
        <Button type="submit" className="px-4 py-2 bg-green-500 rounded-md shadow-[0_0_15px_green] hover:shadow-[0_0_30px_green] text-black">
          Add Order
        </Button>
      </form>

      {/* Orders Table */}
      <div className="overflow-x-auto w-full">
        <Table headers={["ID","Customer","Service","Weight","Price","Status","Payment","Actions"]}>
          {filteredOrders.map((o, i) => (
            <tr key={o.id} className={`${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700 transition-colors`}>
              <td className="px-4 py-2 text-cyan-400 drop-shadow-[0_0_10px_cyan]">{o.id}</td>
              <td className="px-4 py-2">
                {editingOrderId === o.id ? (
                  <select
                    value={editFields.customerId}
                    onChange={(e) => setEditFields(prev => ({ ...prev, customerId: Number(e.target.value) }))}
                    className="border px-2 py-1 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : o.customer.name}
              </td>
              <td className="px-4 py-2">
                {editingOrderId === o.id ? (
                  <select
                    value={editFields.service}
                    onChange={(e) => {
                      const selected = services.find(s => s.name === e.target.value);
                      setEditFields(prev => ({
                        ...prev,
                        service: e.target.value,
                        price: selected?.price || prev.price
                      }));
                    }}
                    className="border px-2 py-1 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    {services.map(s => <option key={s.id} value={s.name}>{s.name} - Rp {s.price}</option>)}
                  </select>
                ) : o.service}
              </td>
              <td className="px-4 py-2">{editingOrderId === o.id ? (
                <input
                  type="number"
                  value={editFields.weight}
                  onChange={(e) => setEditFields(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="border px-2 py-1 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              ) : o.weight}</td>
              <td className="px-4 py-2">{editingOrderId === o.id ? editFields.price : o.price}</td>
              <td className={`px-4 py-2 ${getStatusColor(o.status)}`}>
                {editingOrderId === o.id ? (
                  <select
                    value={editFields.status}
                    onChange={(e) => setEditFields(prev => ({ ...prev, status: e.target.value }))}
                    className="border px-2 py-1 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                    <option value="picked-up">Picked-up</option>
                  </select>
                ) : o.status}
              </td>
              <td className={`px-4 py-2 ${getPaymentColor(o.payment)}`}>
                {editingOrderId === o.id ? (
                  <select
                    value={editFields.payment}
                    onChange={(e) => setEditFields(prev => ({ ...prev, payment: e.target.value }))}
                    className="border px-2 py-1 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                ) : o.payment}
              </td>
              <td className="px-4 py-2 flex gap-2">
                {editingOrderId === o.id ? (
                  <>
                    <Button
                      onClick={() => handleSave(o.id)}
                      className="px-3 py-1 bg-green-500 rounded-md shadow-[0_0_10px_green] hover:shadow-[0_0_20px_green]"
                    >Save</Button>
                    <Button
                      onClick={() => setEditingOrderId(null)}
                      className="px-3 py-1 bg-gray-500 rounded-md shadow-[0_0_10px_gray] hover:shadow-[0_0_20px_gray]"
                    >Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => startEdit(o)}
                      className="px-3 py-1 bg-yellow-500 rounded-md shadow-[0_0_10px_yellow] hover:shadow-[0_0_20px_yellow]"
                    >Edit</Button>
                    <Button
                      onClick={() => handleDelete(o.id)}
                      className="px-3 py-1 bg-red-500 rounded-md shadow-[0_0_10px_red] hover:shadow-[0_0_20px_red]"
                    >Delete</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}