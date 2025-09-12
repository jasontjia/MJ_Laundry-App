import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET, PATCH, DELETE by order id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(params.id) },
      include: { customer: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error("GET /api/orders/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updatedOrder = await prisma.order.update({
      where: { id: Number(params.id) },
      data: {
        status: body.status,
        payment: body.payment,
        service: body.service,
        weight: body.weight,
        price: body.price,
        customerId: body.customerId,
      },
      include: { customer: true },
    });
    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error("PATCH /api/orders/[id] error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.order.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Order deleted" });
  } catch (err) {
    console.error("DELETE /api/orders/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
