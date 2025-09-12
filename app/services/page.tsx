"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import Table from "@/components/ui/table";
import Button from "@/components/ui/button";

interface Service {
  id: number;
  name: string;
  price: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ServicesPage() {
  const { data: services, error } = useSWR<Service[]>("/api/services", fetcher);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    if (editingId) {
      await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, name, price }),
      });
    } else {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price }),
      });
    }

    setName("");
    setPrice("");
    setEditingId(null);
    mutate("/api/services");
  };

  const handleEdit = (s: Service) => {
    setEditingId(s.id);
    setName(s.name);
    setPrice(s.price);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    mutate("/api/services");
  };

  if (error) return <div className="text-red-500">Failed to load services</div>;
  if (!services) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      <h1 className="text-3xl font-bold text-cyan-400">Service Management</h1>

      {/* Form Add/Edit */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <input
          type="text"
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-900 text-white border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-900 text-white border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
        <Button
          type="submit"
          className={`px-6 py-2 rounded-lg font-semibold ${
            editingId
              ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-400/50"
              : "bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-400/50"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </Button>
      </form>

      {/* Services Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg">
        <Table headers={["ID", "Name", "Price", "Actions"]}>
          {services.map((s) => (
            <tr
              key={s.id}
              className="hover:bg-gray-700 transition-colors"
            >
              <td className="px-4 py-2 text-cyan-400">{s.id}</td>
              <td className="px-4 py-2">{s.name}</td>
              <td className="px-4 py-2">{s.price}</td>
              <td className="px-4 py-2 flex gap-2">
                <Button
                  type="button"
                  className="px-3 py-1 bg-yellow-400 rounded-lg hover:bg-yellow-500"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="px-3 py-1 bg-red-500 rounded-lg hover:bg-red-600"
                  onClick={() => handleDelete(s.id)}
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
