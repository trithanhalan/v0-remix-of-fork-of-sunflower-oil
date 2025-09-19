import type { DashboardKPIs, ProductSummary, RoutePerformance } from "./types"

export function generateWhatsAppDailySummary(
  date: string,
  products: ProductSummary[],
  routes: RoutePerformance[],
  kpis: DashboardKPIs,
): string {
  const totalUnits = products.reduce((sum, p) => sum + p.sold, 0)
  const topProducts = products
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3)
    .map((p) => `• ${p.productName.split(" ").slice(0, 2).join(" ")}: ${p.sold} units`)
    .join("\n")

  const routeSummary = routes.map((r) => `• ${r.routeName}: ₹${r.salesAmount.toLocaleString("en-IN")}`).join("\n")

  return `🛢️ Daily Summary - ${date}

📊 SALES OVERVIEW
Total Sales: ₹${kpis.totalSales.toLocaleString("en-IN")}
Units Sold: ${totalUnits}
Active Routes: ${routes.length}

💰 COLLECTION
Cash: ₹${kpis.totalCash.toLocaleString("en-IN")}
Cheque: ₹${kpis.totalCheque.toLocaleString("en-IN")}
Online: ₹${kpis.totalOnlineManual.toLocaleString("en-IN")}
Discounts: ₹${kpis.totalDiscounts.toLocaleString("en-IN")}

🏆 TOP PRODUCTS
${topProducts}

🚛 ROUTE PERFORMANCE
${routeSummary}

${kpis.cashOverShort !== 0 ? `⚠️ Cash Variance: ₹${Math.abs(kpis.cashOverShort).toLocaleString("en-IN")} ${kpis.cashOverShort > 0 ? "OVER" : "SHORT"}` : "✅ Cash Balanced"}

#OilBusiness #DailySummary`
}

export function generateWhatsAppPricingUpdate(
  date: string,
  products: Array<{ name: string; packLabel: string; unitPrice: number }>,
): string {
  const productsByCategory = products.reduce(
    (acc, product) => {
      const category = product.name.includes("Sunflower")
        ? "Sunflower"
        : product.name.includes("Palmstar")
          ? "Palmstar"
          : "Lamp Oil"

      if (!acc[category]) acc[category] = []
      acc[category].push(product)
      return acc
    },
    {} as Record<string, typeof products>,
  )

  let message = `🛢️ Price Update - ${date}\n\n`

  Object.entries(productsByCategory).forEach(([category, items]) => {
    message += `${category.toUpperCase()}\n`
    items.forEach((item) => {
      message += `• ${item.packLabel} - ₹${item.unitPrice.toLocaleString("en-IN")}\n`
    })
    message += "\n"
  })

  message += "#PriceUpdate #OilRates"

  return message
}

export function calculateCashOverShort(expectedCash: number, actualCash: number, expenses: number): number {
  const netCashInHand = actualCash - expenses
  return netCashInHand - expectedCash
}

export function calculateProductVariance(expected: number, actual: number): number {
  return actual - expected
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`
}

export function calculateRouteEfficiency(dispatched: number, sold: number): number {
  if (dispatched === 0) return 0
  return Math.round((sold / dispatched) * 100)
}
