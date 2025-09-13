"use client";

import useSWR from "swr";
import { useState } from "react";
import { Order } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import '../../globals.css';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function ReportsPage() {
  const { data: orders, error } = useSWR<Order[]>("/api/orders", fetcher);
  const [filterCustomer, setFilterCustomer] = useState<number | "">("");
  const [filterStatus, setFilterStatus] = useState<"" | Order["status"]>("");

  if (error) return <div className="text-red-500">Failed to load orders</div>;
  if (!orders) return <div className="text-gray-500">Loading...</div>;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const customerMatch = filterCustomer ? o.customer.id === filterCustomer : true;
    const statusMatch = filterStatus ? o.status === filterStatus : true;
    return customerMatch && statusMatch;
  });

  // Revenue per day
  const revenuePerDay: { [key: string]: number } = {};
  filteredOrders.forEach((o) => {
    const day = o.createdAt.split("T")[0];
    if (!revenuePerDay[day]) revenuePerDay[day] = 0;
    revenuePerDay[day] += o.price;
  });

  const barData = Object.entries(revenuePerDay).map(([day, revenue]) => ({
    day,
    revenue,
  }));

  const statusCounts = {
    pending: filteredOrders.filter((o) => o.status === "pending").length,
    "in-progress": filteredOrders.filter((o) => o.status === "in-progress").length,
    completed: filteredOrders.filter((o) => o.status === "completed").length,
    "picked-up": filteredOrders.filter((o) => o.status === "picked-up").length,
  };

  const pieData = Object.entries(statusCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  // Export Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredOrders.map((o) => ({
        Customer: o.customer.name,
        Service: o.service,
        Weight: o.weight,
        Price: o.price,
        Status: o.status,
        Payment: o.payment,
        CreatedAt: o.createdAt,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders_report.xlsx");
  };

  // Export PDF
  interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number };
}

  const handleExportPDF = () => {
    const doc = new jsPDF() as JsPDFWithAutoTable;

    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("MJ Laundry", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Jl. Contoh Alamat No.123, Kota, Indonesia", 105, 20, { align: "center" });
    doc.text("Laporan Transaksi", 105, 28, { align: "center" });

    // Table
    autoTable(doc, {
      startY: 35,
      head: [["Customer","Service","Weight","Price","Status","Payment","CreatedAt"]],
      body: filteredOrders.map((o) => [
        o.customer.name,
        o.service,
        o.weight,
        o.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" }),
        o.status,
        o.payment,
        new Date(o.createdAt).toLocaleDateString("id-ID"),
      ]),
      headStyles: { fillColor: [0,123,255], textColor: 255, halign: "center" },
      bodyStyles: { fillColor: [245,245,245] },
      alternateRowStyles: { fillColor: [230,230,230] },
      styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
    });

    // Footer / total revenue
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.price, 0);
    const finalY = doc.lastAutoTable?.finalY || 35; // sekarang type-safe
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Revenue: ${totalRevenue.toLocaleString("id-ID", { 
        style: "currency", 
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`,
      105,
      finalY + 10,
      { align: "center" }
    );

    doc.save("orders_report.pdf");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white space-y-8">
      <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_15px_cyan] mb-6">
        Reports Transactions
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterCustomer}
          onChange={(e) =>
            setFilterCustomer(e.target.value ? Number(e.target.value) : "")
          }
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">All Customers</option>
          {Array.from(new Set(orders.map((o) => o.customer.id))).map((id) => (
            <option key={id} value={id}>
              {orders.find((o) => o.customer.id === id)?.customer.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Order["status"] | "")}
          className="border px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
          <option value="picked-up">Picked-up</option>
        </select>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-500 rounded-md shadow-[0_0_15px_green] hover:shadow-[0_0_30px_green] text-black"
        >
          Export Excel
        </button>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-blue-500 rounded-md shadow-[0_0_15px_blue] hover:shadow-[0_0_30px_blue] text-black"
        >
          Export PDF
        </button>
      </div>

      {/* Revenue Bar Chart */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Revenue per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Pie Chart */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Orders Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
