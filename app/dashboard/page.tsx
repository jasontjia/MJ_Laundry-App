"use client";

import useSWR from "swr";
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

interface Customer {
  id: number;
  name: string;
}

interface OrderType {
  id: number;
  customer: Customer;
  service: string;
  weight: number;
  price: number;
  status: "pending" | "in-progress" | "completed" | "picked-up";
  payment: "unpaid" | "partial" | "paid";
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const COLORS = ["#00ffff", "#ff00ff", "#ffea00", "#00ff99"];

export default function DashboardPage() {
  const { data: orders, error: ordersError } = useSWR<OrderType[]>("/api/orders", fetcher);

  if (ordersError)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl animate-pulse">
        Failed to load orders
      </div>
    );

  if (!orders)
    return (
      <div className="flex justify-center items-center min-h-screen text-cyan-400 text-xl animate-pulse">
        Loading...
      </div>
    );

  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const paidOrders = orders.filter((o) => o.payment === "paid").length;
  const unpaidOrders = orders.filter((o) => o.payment === "unpaid").length;

  const barData = orders.map((o) => ({ name: `#${o.id}`, price: o.price }));
  const pieData = [
    { name: "Pending", value: pendingOrders },
    { name: "Completed", value: completedOrders },
    { name: "Other", value: orders.length - pendingOrders - completedOrders },
  ];
  const paymentPieData = [
    { name: "Paid", value: paidOrders },
    { name: "Unpaid", value: unpaidOrders },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-10">
      <h1 className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_25px_cyan] animate-pulse">
        MJ Laundry Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow-[0_0_25px_cyan]">
          <div className="text-sm text-gray-300">Total Orders</div>
          <div className="text-2xl font-bold text-cyan-400">{orders.length}</div>
        </div>
      <div className="bg-gray-800 p-4 rounded-xl shadow-[0_0_25px-green]">
        <div className="text-sm text-gray-300">Total Revenue</div>
        <div className="text-2xl font-bold text-green-400">
          {totalRevenue.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
      </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-[0_0_25px-yellow]">
          <div className="text-sm text-gray-300">Pending Orders</div>
          <div className="text-2xl font-bold text-yellow-400">{pendingOrders}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-[0_0_25px-purple]">
          <div className="text-sm text-gray-300">Completed Orders</div>
          <div className="text-2xl font-bold text-purple-400">{completedOrders}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow-[0_0_25px-cyan]">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Revenue per Order</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#00ffff" />
              <YAxis
                stroke="#00ffff"
                tickFormatter={(value) =>
                  `Rp ${value.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                }
              />
              <Tooltip
                formatter={(value) =>
                  `Rp ${value.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                }
              />
              <Bar dataKey="price" fill="#00ffff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl shadow-[0_0_25px-magenta]">
          <h2 className="text-lg font-semibold text-magenta-400 mb-4">Order Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-xl shadow-[0_0_25px-green]">
        <h2 className="text-lg font-semibold text-green-400 mb-4">Payment Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={paymentPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {paymentPieData.map((_, index) => (
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
