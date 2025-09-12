import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const { name, price } = await req.json();
  const service = await prisma.service.create({ data: { name, price } });
  return NextResponse.json(service);
}

export async function PATCH(req: Request) {
  const { id, name, price } = await req.json();
  const service = await prisma.service.update({
    where: { id },
    data: { name, price },
  });
  return NextResponse.json(service);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
