/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// --- Helpers ---
const todayISO = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

type ProductSeed = {
  id: string
  name: string
  category: "SUNFLOWER" | "PALMSTAR" | "LAMP"
  packLabel: string
  conversionFactorKgPerUnit: number // kg per unit
  active?: boolean
}

// Rounded density assumptions for conversion (adjust if you maintain exacts elsewhere):
// - 30kg, 15kg packs are exact
// - 15L tin ≈ 13.6 kg (given by you)
// - 5L ≈ 4.5 kg (0.9 density indicative)
// - 1L ≈ 0.91 kg
// - 850ml ≈ 0.77 kg
// - 425ml ≈ 0.39 kg
const KG_30 = 30.0
const KG_15 = 15.0
const KG_15L = 13.6
const KG_5L = 4.5
const KG_1L = 0.91
const KG_850ML = 0.77
const KG_425ML = 0.39

// --- Seed Data ---

const routes = [
  { id: "ROUTE_UTHUKOTAI", name: "Uthukota" },
  { id: "ROUTE_ARAKONAM", name: "Arakonam" },
  { id: "ROUTE_ACHARAPAKKAM", name: "Acharapakkam" },
  { id: "ROUTE_KALPAKKAM", name: "Kalpakkam" },
  { id: "ROUTE_POONAMALLEE", name: "Poonamali" },
  { id: "ROUTE_PONNERI", name: "Ponneri" },
  { id: "ROUTE_ECR", name: "ECR" },
]

const vehicles = [
  { id: "VH_2259", number: "2259", active: true },
  { id: "VH_5149", number: "5149", active: true },
  { id: "VH_3083", number: "3083", active: true },
  { id: "VH_4080", number: "4080", active: true },
  { id: "VH_0456", number: "0456", active: true },
]

const shopsByRoute: Record<string, { id: string; name: string }[]> = {
  ROUTE_UTHUKOTAI: [
    { id: "SHOP_UTHU_001", name: "Sri Maruthi Stores" },
    { id: "SHOP_UTHU_002", name: "Lakshmi Oil Depot" },
    { id: "SHOP_UTHU_003", name: "Ganesh Provisions" },
  ],
  ROUTE_ARAKONAM: [
    { id: "SHOP_ARA_001", name: "Arakonam Supermart" },
    { id: "SHOP_ARA_002", name: "Raja & Co." },
    { id: "SHOP_ARA_003", name: "Venkatesh Stores" },
  ],
  ROUTE_ACHARAPAKKAM: [
    { id: "SHOP_ACP_001", name: "ACM Traders" },
    { id: "SHOP_ACP_002", name: "Sri Amman Provisions" },
    { id: "SHOP_ACP_003", name: "Sathya General" },
  ],
  ROUTE_KALPAKKAM: [
    { id: "SHOP_KPK_001", name: "Kalpakkam Bazaar" },
    { id: "SHOP_KPK_002", name: "Coastline Stores" },
    { id: "SHOP_KPK_003", name: "Nandhini Oil Point" },
  ],
  ROUTE_POONAMALLEE: [
    { id: "SHOP_PNM_001", name: "Poonamallee Mart" },
    { id: "SHOP_PNM_002", name: "Aishwarya Traders" },
    { id: "SHOP_PNM_003", name: "Selvam Stores" },
  ],
  ROUTE_PONNERI: [
    { id: "SHOP_PON_001", name: "Ponneri Depot" },
    { id: "SHOP_PON_002", name: "Annapoorna Provisions" },
    { id: "SHOP_PON_003", name: "Murugan Stores" },
  ],
  ROUTE_ECR: [
    { id: "SHOP_ECR_001", name: "ECR Mart" },
    { id: "SHOP_ECR_002", name: "Shoreline Traders" },
    { id: "SHOP_ECR_003", name: "Bay View Provisions" },
  ],
}

const products: ProductSeed[] = [
  // Sunflower
  {
    id: "SF_30KG",
    name: "Sunflower 30kg Can",
    category: "SUNFLOWER",
    packLabel: "30kg Can",
    conversionFactorKgPerUnit: KG_30,
  },
  {
    id: "SF_15KG",
    name: "Sunflower 15kg Tin",
    category: "SUNFLOWER",
    packLabel: "15kg Tin",
    conversionFactorKgPerUnit: KG_15,
  },
  {
    id: "SF_15L",
    name: "Sunflower 15L Tin",
    category: "SUNFLOWER",
    packLabel: "15L Tin",
    conversionFactorKgPerUnit: KG_15L,
  },
  {
    id: "SF_5L",
    name: "Sunflower 5L Can",
    category: "SUNFLOWER",
    packLabel: "5L Can",
    conversionFactorKgPerUnit: KG_5L,
  },
  {
    id: "SF_1L",
    name: "Sunflower 1L Pouch",
    category: "SUNFLOWER",
    packLabel: "1L Pouch",
    conversionFactorKgPerUnit: KG_1L,
  },
  {
    id: "SF_850",
    name: "Sunflower 850ml",
    category: "SUNFLOWER",
    packLabel: "850ml",
    conversionFactorKgPerUnit: KG_850ML,
  },
  {
    id: "SF_425",
    name: "Sunflower 425ml",
    category: "SUNFLOWER",
    packLabel: "425ml",
    conversionFactorKgPerUnit: KG_425ML,
  },

  // Palmstar
  {
    id: "PS_30KG",
    name: "Palmstar 30kg Can",
    category: "PALMSTAR",
    packLabel: "30kg Can",
    conversionFactorKgPerUnit: KG_30,
  },
  {
    id: "PS_15L",
    name: "Palmstar 15L Tin",
    category: "PALMSTAR",
    packLabel: "15L Tin",
    conversionFactorKgPerUnit: KG_15L,
  },
  { id: "PS_5L", name: "Palmstar 5L Can", category: "PALMSTAR", packLabel: "5L Can", conversionFactorKgPerUnit: KG_5L },
  {
    id: "PS_1L",
    name: "Palmstar 1L Pouch",
    category: "PALMSTAR",
    packLabel: "1L Pouch",
    conversionFactorKgPerUnit: KG_1L,
  },
  {
    id: "PS_850",
    name: "Palmstar 850ml",
    category: "PALMSTAR",
    packLabel: "850ml",
    conversionFactorKgPerUnit: KG_850ML,
  },
  {
    id: "PS_425",
    name: "Palmstar 425ml",
    category: "PALMSTAR",
    packLabel: "425ml",
    conversionFactorKgPerUnit: KG_425ML,
  },

  // Lamp oil (if you use it similarly; adjust factors if density differs materially)
  { id: "LAMP_5L", name: "Lamp Oil 5L", category: "LAMP", packLabel: "5L", conversionFactorKgPerUnit: KG_5L },
  { id: "LAMP_1L", name: "Lamp Oil 1L", category: "LAMP", packLabel: "1L", conversionFactorKgPerUnit: KG_1L },
]

type RatesPerKg = { sunflower: number; palmstar: number; lamp: number }
/**
 * Base rate per kg (SELLING) — you told us sunflower is ₹130/kg (not 1300).
 * Adjust palm/lamp as needed. These will be used to create today's PriceRecord per product.
 */
const todaysRates: RatesPerKg = {
  sunflower: 130, // ₹/kg
  palmstar: 95, // example ₹/kg
  lamp: 90, // example ₹/kg
}

// Assign a default vehicle per route for demo users
const defaultVehicleByRoute: Record<string, string> = {
  ROUTE_UTHUKOTAI: "VH_2259",
  ROUTE_ARAKONAM: "VH_5149",
  ROUTE_ACHARAPAKKAM: "VH_3083",
  ROUTE_KALPAKKAM: "VH_4080",
  ROUTE_POONAMALLEE: "VH_0456",
  ROUTE_PONNERI: "VH_2259",
  ROUTE_ECR: "VH_5149",
}

// Demo users: 1 manager, 1 factory, 1 salesperson per route
const users = [
  { id: "USR_MANAGER", name: "Manager", role: "MANAGER" as const },
  { id: "USR_FACTORY", name: "Factory Staff", role: "FACTORY" as const },
  // Salespersons per route:
  ...routes.map((r, i) => ({
    id: `USR_SALES_${i + 1}`,
    name: `Sales ${r.name}`,
    role: "SALESPERSON" as const,
    routeId: r.id,
    vehicleId: defaultVehicleByRoute[r.id],
  })),
]

// --- Seed Runner ---
async function main() {
  console.log("Seeding routes...")
  for (const r of routes) {
    await prisma.route.upsert({
      where: { id: r.id },
      update: { name: r.name },
      create: { id: r.id, name: r.name },
    })
  }

  console.log("Seeding vehicles...")
  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      update: { number: v.number, active: v.active },
      create: { id: v.id, number: v.number, active: v.active },
    })
  }

  console.log("Seeding shops...")
  for (const [routeId, shops] of Object.entries(shopsByRoute)) {
    for (const s of shops) {
      await prisma.shop.upsert({
        where: { id: s.id },
        update: { name: s.name, routeId },
        create: { id: s.id, name: s.name, routeId, active: true },
      })
    }
  }

  console.log("Seeding products...")
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        category: p.category,
        packLabel: p.packLabel,
        conversionFactorKgPerUnit: p.conversionFactorKgPerUnit,
        active: p.active ?? true,
      },
      create: {
        id: p.id,
        name: p.name,
        category: p.category,
        packLabel: p.packLabel,
        conversionFactorKgPerUnit: p.conversionFactorKgPerUnit,
        active: p.active ?? true,
      },
    })
  }

  console.log("Seeding users...")
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        role: u.role,
        routeId: (u as any).routeId ?? null,
        vehicleId: (u as any).vehicleId ?? null,
      },
      create: {
        id: u.id,
        name: u.name,
        role: u.role,
        routeId: (u as any).routeId ?? null,
        vehicleId: (u as any).vehicleId ?? null,
      },
    })
  }

  console.log("Seeding today PriceRecord per product...")
  const date = todayISO()
  for (const p of products) {
    let baseRatePerKg = todaysRates.lamp
    if (p.category === "SUNFLOWER") baseRatePerKg = todaysRates.sunflower
    if (p.category === "PALMSTAR") baseRatePerKg = todaysRates.palmstar

    const conversion = p.conversionFactorKgPerUnit
    const unitPrice = +(baseRatePerKg * conversion).toFixed(2)

    // Create a price record for today (keep history)
    await prisma.priceRecord.create({
      data: {
        date,
        productId: p.id,
        baseRatePerKg,
        conversionFactor: conversion,
        unitPrice,
        createdBy: "USR_MANAGER",
      },
    })
  }

  console.log("Seed completed ✅")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
