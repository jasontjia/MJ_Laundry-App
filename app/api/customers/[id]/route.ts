import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET by id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(params.id) },
    });
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    return NextResponse.json(customer);
  } catch (err) {
    console.error("GET /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

// PATCH update
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.customer.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.customer.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Customer deleted" });
  } catch (err) {
    console.error("DELETE /api/customers/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
