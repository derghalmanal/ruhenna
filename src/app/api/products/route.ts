import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const gift = searchParams.get("gift");
    const featured = searchParams.get("featured");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)));

    const where: { active?: boolean; category?: string; isGiftOption?: boolean; featured?: boolean } = { active: true };
    if (category) where.category = category;
    if (gift === "true") where.isGiftOption = true;
    if (featured === "true") where.featured = true;

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ success: false, message: "Erreur lors de la récupération des produits" }, { status: 500 });
  }
}
