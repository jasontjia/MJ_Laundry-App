"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import Table from "@/components/ui/table";
import Button from "@/components/ui/button";
import { Customer } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustomersPage() {
  const { data: customers, error } = useSWR<Customer[]>("/api/customers", fetcher);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return;

    if (editingId) {
      await fetch(`/api/customers/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
    } else {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
    }

    setName("");
    setPhone("");
    setAddress("");
    setEditingId(null);
    mutate("/api/customers");
  };

  const handleEdit = (c: Customer) => {
    setEditingId(c.id);
    setName(c.name ?? "");
    setPhone(c.phone ?? "");
    setAddress(c.address ?? "");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this customer?")) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    mutate("/api/customers");
  };

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        Failed to load customers
      </div>
    );

  if (!customers)
    return (
      <div className="flex justify-center items-center min-h-screen text-cyan-400 text-xl animate-pulse">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 md:p-8 lg:p-12 space-y-10">
      <h2 className="text-5xl font-bold text-cyan-400 tracking-wide drop-shadow-[0_0_25px_cyan] animate-pulse">
        Customer Management
      </h2>

      {/* Form Add/Edit */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg shadow-cyan-500/40 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-end transition-all duration-300"
      >
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-cyan-300 mb-1">Name</label>
          <input
            type="text"
            className="border border-cyan-500 rounded-lg px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-cyan-300 mb-1">Phone</label>
          <input
            type="text"
            className="border border-cyan-500 rounded-lg px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812xxxxxx"
            required
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-cyan-300 mb-1">Address</label>
          <input
            type="text"
            className="border border-cyan-500 rounded-lg px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Customer address"
            required
          />
        </div>

        <Button
          type="submit"
          className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
            editingId
              ? "bg-green-500 hover:bg-green-600 shadow-[0_0_20px_green] hover:shadow-[0_0_35px_green]"
              : "bg-cyan-500 hover:bg-cyan-600 shadow-[0_0_20px_cyan] hover:shadow-[0_0_35px_cyan]"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </Button>
      </form>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-gray-800 shadow-lg shadow-cyan-500/40 rounded-2xl">
        <Table headers={["ID", "Name", "Phone", "Address", "Actions"]}>
          {customers.map((c, i) => (
            <tr
              key={c.id}
              className={`${
                i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
              } hover:bg-gray-700 transition-colors`}
            >
              <td className="px-4 py-3 font-medium text-cyan-400 drop-shadow-[0_0_10px_cyan]">
                {c.id}
              </td>
              <td className="px-4 py-3 text-white drop-shadow-[0_0_8px_white]">{c.name}</td>
              <td className="px-4 py-3 text-gray-300">{c.phone}</td>
              <td className="px-4 py-3 text-gray-300">{c.address}</td>
              <td className="px-4 py-3 flex gap-2">
                <Button
                  type="button"
                  className="px-4 py-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 shadow-[0_0_10px_yellow] hover:shadow-[0_0_20px_yellow] transition"
                  onClick={() => handleEdit(c)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-[0_0_10px_red] hover:shadow-[0_0_20px_red] transition"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
