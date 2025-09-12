"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
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

  // Sorting
  const [sortField, setSortField] = useState<keyof Service>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5); // kelipatan 5

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

  const toggleSort = (field: keyof Service) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (error) return <div className="text-red-500">Failed to load services</div>;
  if (!services) return <div className="text-gray-500">Loading...</div>;

  // Sorting
  const sortedServices = [...services].sort((a, b) => {
    let aVal: string | number = a[sortField];
    let bVal: string | number = b[sortField];

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentServices = sortedServices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedServices.length / entriesPerPage);

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
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setPrice(val ? Number(val) : "");
          }}
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

      {/* Entries per page */}
      <div className="flex justify-between items-center">
        <div>
          <label>
            Entries per page:{" "}
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-800 border border-cyan-500 rounded px-2 py-1 text-white"
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto w-full bg-gray-800 rounded-2xl shadow-[0_0_20px_cyan] p-1">
        <table className="w-full text-left border-collapse rounded-lg bg-gray-850">
          <thead className="bg-gray-900 rounded-t-lg">
            <tr>
              {["no", "name", "price"].map((field) => (
                <th
                  key={field}
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => field !== "no" && toggleSort(field as keyof Service)}
                >
                  {field === "no" ? "No" : field.charAt(0).toUpperCase() + field.slice(1)}
                  {sortField === field ? (sortOrder === "asc" ? " ↑" : " ↓") : ""}
                </th>
              ))}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentServices.map((s, i) => (
              <tr
                key={s.id}
                className={`${i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-700 transition-colors rounded-md`}
              >
                <td className="px-4 py-2 text-cyan-400 drop-shadow-[0_0_10px_cyan]">{indexOfFirst + i + 1}</td>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2 text-green-400 drop-shadow-[0_0_10px_green]">
                  {s.price.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    type="button"
                    className="px-3 py-1 bg-yellow-500 rounded-md shadow-[0_0_10px_yellow] hover:shadow-[0_0_20px_yellow]"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className="px-3 py-1 bg-red-500 rounded-md shadow-[0_0_10px_red] hover:shadow-[0_0_20px_red]"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        Page {currentPage} of {totalPages}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-2">
        <Button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
        >
          Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <Button
            key={num}
            type="button"
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded-md ${
              currentPage === num ? "bg-cyan-500" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {num}
          </Button>
        ))}
        <Button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
