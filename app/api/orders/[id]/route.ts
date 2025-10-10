import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/orders/:id
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { customer: true },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/orders/:id
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const deleted = await prisma.order.delete({ where: { id: Number(id) } });
    return NextResponse.json(deleted);
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/orders/:id
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
