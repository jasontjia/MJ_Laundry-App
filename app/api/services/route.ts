import { NextResponse } from "next/server";

let services = [
  { id: 1, name: "Cuci Kering", price: 15000 },
  { id: 2, name: "Cuci Basah + Setrika", price: 25000 },
  { id: 3, name: "Setrika Saja", price: 10000 },
];

export async function GET() {
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newService = {
    id: services.length ? services[services.length - 1].id + 1 : 1,
    name: body.name,
    price: body.price,
  };
  services.push(newService);
  return NextResponse.json(newService);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const idx = services.findIndex((s) => s.id === body.id);
  if (idx !== -1) {
    services[idx] = { ...services[idx], ...body };
  }
  return NextResponse.json(services[idx]);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  services = services.filter((s) => s.id !== id);
  return NextResponse.json({ success: true });
}
