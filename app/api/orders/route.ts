import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { customer: true }, // ambil data customer
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// POST create new order
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newOrder = await prisma.order.create({
      data: {
        customerId: body.customerId,
        service: body.service,
        weight: body.weight,
        price: body.price,
        status: body.status || "pending",
        payment: body.payment || "unpaid",
      },
      include: { customer: true },
    });
    return NextResponse.json(newOrder);
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}