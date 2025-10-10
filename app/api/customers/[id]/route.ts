import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

// GET /api/customers/[id]
export async function GET(req: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (err) {
    console.error("GET /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/customers/[id]
export async function PATCH(req: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = await req.json();

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: Number(id) },
      data: body,
    });

    return NextResponse.json(updatedCustomer);
  } catch (err) {
    console.error("PATCH /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/customers/[id]
export async function DELETE(req: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    await prisma.customer.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
