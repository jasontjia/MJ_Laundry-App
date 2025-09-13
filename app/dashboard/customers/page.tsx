'use client';

import { useState, useMemo } from "react";
import useSWR, { mutate } from "swr";
import Button from "@/components/ui/button";
import { Customer } from "@/lib/types";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import '../../globals.css';


const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CustomersPage() {
  const { data: customers, error } = useSWR<Customer[]>("/api/customers", fetcher);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Customer | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // Filter & Sort
  const filtered = useMemo(() => {
    if (!customers) return [];
    const result = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.address ?? "").toLowerCase().includes(search.toLowerCase())
    );

    if (sortColumn) {
      result.sort((a, b) => {
        const valA = (a[sortColumn] ?? "").toString().toLowerCase();
        const valB = (b[sortColumn] ?? "").toString().toLowerCase();
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [customers, search, sortColumn, sortOrder]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (column: keyof Customer) => {
    if (sortColumn === column) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortColumn(column);
      setSortOrder("asc");
    }
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

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, filtered.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 md:p-8 lg:p-12 space-y-6">
      <h2 className="text-5xl font-bold text-cyan-400 tracking-wide drop-shadow-[0_0_25px_cyan] animate-pulse">
        Customer Management
      </h2>

      {/* Search & Entries */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white px-2 py-1 rounded-md"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Form Add/Edit */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-lg shadow-cyan-500/40 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-end transition-all duration-300"
      >
        {["Name", "Phone", "Address"].map((label) => {
          const value =
            label === "Name" ? name : label === "Phone" ? phone : address;
          const setValue =
            label === "Name" ? setName : label === "Phone" ? setPhone : setAddress;
          const placeholder =
            label === "Name"
              ? "Enter customer name"
              : label === "Phone"
              ? "0812xxxxxx"
              : "Customer address";

          return (
            <div className="flex flex-col flex-1" key={label}>
              <label className="text-sm font-medium text-cyan-300 mb-1">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  if (label === "Phone") {
                    // cuma angka
                    setValue(e.target.value.replace(/\D/g, ""));
                  } else {
                    setValue(e.target.value);
                  }
                }}
                placeholder={placeholder}
                className="border border-cyan-500 rounded-lg px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400 transition"
                required
              />
            </div>
          );
        })}
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
      {/* Entries info */}
      <div className="text-gray-300 text-sm">
        Showing {startEntry}-{endEntry} of {filtered.length} entries
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-gray-800 shadow-lg shadow-cyan-500/40 rounded-2xl">
        <table className="min-w-full">
          <thead className="bg-gray-900">
            <tr>
              {["No", "Name", "Phone", "Address"].map((h) => {
                const key = h.toLowerCase() as keyof Customer | "no";
                return (
                  <th
                    key={h}
                    className="px-4 py-3 cursor-pointer select-none text-left"
                    onClick={() => key !== "no" && toggleSort(key as keyof Customer)}
                  >
                    <div className="flex items-center gap-1">
                      {h}
                      {key !== "no" &&
                        (sortColumn === key ? (
                          sortOrder === "asc" ? (
                            <HiArrowUp className="w-4 h-4" />
                          ) : (
                            <HiArrowDown className="w-4 h-4" />
                          )
                        ) : (
                          <HiArrowDown className="w-4 h-4 opacity-30" />
                        ))}
                    </div>
                  </th>
                );
              })}
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c, idx) => (
              <tr
                key={c.id}
                className={`${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"} hover:bg-gray-700 transition-colors`}
              >
                <td className="px-4 py-3 font-medium text-cyan-400 drop-shadow-[0_0_10px_cyan]">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="px-4 py-3 text-white drop-shadow-[0_0_8px_white]">{c.name}</td>
                <td className="px-4 py-3 text-gray-300">{c.phone ?? "-"}</td>
                <td className="px-4 py-3 text-gray-300">{c.address ?? "-"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Button
                    type="button"
                    className="px-4 py-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              className={`px-3 ${currentPage === i + 1 ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-200"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
