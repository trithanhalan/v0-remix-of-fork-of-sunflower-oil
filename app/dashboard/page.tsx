"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { DashboardCards } from "@/components/dashboard-cards"
import { ProductSummaryTable } from "@/components/product-summary-table"
import { RouteLiveView } from "@/components/route-live-view"
import { ExceptionsPanel } from "@/components/exceptions-panel"
import { WhatsAppPreview } from "@/components/whatsapp-preview"

import { generateWhatsAppDailySummary, generateWhatsAppPricingUpdate } from "@/lib/calculations"
import type { DashboardKPIs, ProductSummary, RoutePerformance } from "@/lib/types"

const mockKPIs: DashboardKPIs = {
  totalSales: 453800,
  totalCash: 350000,
  totalCheque: 50000,
  totalOnlineManual: 25000,
  totalDiscounts: 28800,
  totalExpenses: 15000,
  netCash: 335000,
  cashOverShort: 0,
  stockDiscrepancyCount: 2,
}

const mockProductSummaries: ProductSummary[] = [
  {
    productId: "SF_30KG",
    productName: "Sunflower 30kg Can",
    opening: 50,
    receipts: 10,
    dispatched: 25,
    returned: 3,
    sold: 22,
    closingExpected: 38,
    closingActual: 37,
    variance: -1,
    unitPrice: 3900,
    revenue: 85800,
  },
  {
    productId: "SF_15L",
    productName: "Sunflower 15L Tin",
    opening: 100,
    receipts: 20,
    dispatched: 60,
    returned: 8,
    sold: 52,
    closingExpected: 68,
    closingActual: 68,
    variance: 0,
    unitPrice: 1768,
    revenue: 91936,
  },
  {
    productId: "PS_15L",
    productName: "Palmstar 15L Tin",
    opening: 80,
    receipts: 15,
    dispatched: 40,
    returned: 5,
    sold: 35,
    closingExpected: 60,
    closingActual: 61,
    variance: 1,
    unitPrice: 1292,
    revenue: 45220,
  },
]

const mockRoutePerformances: RoutePerformance[] = [
  {
    routeId: "ROUTE_UTHUKOTAI",
    routeName: "Uthukota",
    vehicleId: "2259",
    dispatched: 48,
    sold: 42,
    onTruckRemaining: 3,
    returns: 3,
    salesAmount: 156000,
  },
  {
    routeId: "ROUTE_ARAKONAM",
    routeName: "Arakonam",
    vehicleId: "5149",
    dispatched: 34,
    sold: 30,
    onTruckRemaining: 2,
    returns: 2,
    salesAmount: 98500,
  },
  {
    routeId: "ROUTE_KALPAKKAM",
    routeName: "Kalpakkam",
    vehicleId: "4080",
    dispatched: 28,
    sold: 25,
    onTruckRemaining: 1,
    returns: 2,
    salesAmount: 87300,
  },
]

const mockExceptions = [
  {
    id: "1",
    type: "stock_variance" as const,
    severity: "medium" as const,
    title: "Stock Variance Detected",
    description: "Sunflower 30kg Can shows -1 unit variance",
    value: "Expected: 38, Actual: 37",
  },
  {
    id: "2",
    type: "high_discount" as const,
    severity: "high" as const,
    title: "High Discount Invoice",
    description: "Invoice #INV-2024-001 has discount above threshold",
    value: "Discount: ₹5,000 (12.5%)",
  },
]

export default function DashboardPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const dailySummary = generateWhatsAppDailySummary(
    new Date().toLocaleDateString("en-IN"),
    mockProductSummaries,
    mockRoutePerformances,
    mockKPIs,
  )

  const pricingUpdate = generateWhatsAppPricingUpdate(
    new Date().toLocaleDateString("en-IN"),
    mockProductSummaries.map((p) => ({
      name: p.productName.split(" ").slice(0, 2).join(" "),
      packLabel: p.productName.split(" ").slice(-2).join(" "),
      unitPrice: p.unitPrice,
    })),
  )

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
    toast({
      title: "Dashboard Updated",
      description: "Latest data has been loaded successfully",
    })
  }

  const handleExportReport = () => {
    const reportData = {
      date: new Date().toLocaleDateString("en-IN"),
      kpis: mockKPIs,
      products: mockProductSummaries,
      routes: mockRoutePerformances,
      summary: dailySummary,
    }

    // Generate CSV content
    const csvContent = generateCSVReport(reportData)

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `oil-inventory-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Completed",
      description: "Daily report has been downloaded successfully",
    })
  }

  const generateCSVReport = (data: any) => {
    let csv = "Oil Inventory Daily Report\n"
    csv += `Date: ${data.date}\n\n`

    // KPIs Section
    csv += "KEY PERFORMANCE INDICATORS\n"
    csv += "Metric,Value\n"
    csv += `Total Sales,₹${data.kpis.totalSales.toLocaleString("en-IN")}\n`
    csv += `Total Cash,₹${data.kpis.totalCash.toLocaleString("en-IN")}\n`
    csv += `Total Cheque,₹${data.kpis.totalCheque.toLocaleString("en-IN")}\n`
    csv += `Total Online,₹${data.kpis.totalOnlineManual.toLocaleString("en-IN")}\n`
    csv += `Total Discounts,₹${data.kpis.totalDiscounts.toLocaleString("en-IN")}\n`
    csv += `Net Cash,₹${data.kpis.netCash.toLocaleString("en-IN")}\n`
    csv += `Cash Over/Short,₹${data.kpis.cashOverShort}\n\n`

    // Products Section
    csv += "PRODUCT SUMMARY\n"
    csv +=
      "Product,Opening,Receipts,Dispatched,Returned,Sold,Closing Expected,Closing Actual,Variance,Unit Price,Revenue\n"
    data.products.forEach((product: ProductSummary) => {
      csv += `${product.productName},${product.opening},${product.receipts},${product.dispatched},${product.returned},${product.sold},${product.closingExpected},${product.closingActual},${product.variance},₹${product.unitPrice},₹${product.revenue}\n`
    })
    csv += "\n"

    // Routes Section
    csv += "ROUTE PERFORMANCE\n"
    csv += "Route,Vehicle,Dispatched,Sold,On Truck,Returns,Sales Amount\n"
    data.routes.forEach((route: RoutePerformance) => {
      csv += `${route.routeName},${route.vehicleId},${route.dispatched},${route.sold},${route.onTruckRemaining},${route.returns},₹${route.salesAmount}\n`
    })

    return csv
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated:{" "}
            {lastUpdated.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <DashboardCards kpis={mockKPIs} />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Route Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Live View</CardTitle>
                  <CardDescription>Real-time performance by route and vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  <RouteLiveView routes={mockRoutePerformances} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Exceptions Panel */}
              <ExceptionsPanel exceptions={mockExceptions} />

              {/* WhatsApp Preview */}
              <WhatsAppPreview dailySummary={dailySummary} pricingUpdate={pricingUpdate} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Summary</CardTitle>
              <CardDescription>Complete inventory and sales overview for all products</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSummaryTable products={mockProductSummaries} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Performance Details</CardTitle>
              <CardDescription>Detailed view of all active routes and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <RouteLiveView routes={mockRoutePerformances} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Summary Report</CardTitle>
                <CardDescription>WhatsApp-ready daily business summary</CardDescription>
              </CardHeader>
              <CardContent>
                <WhatsAppPreview dailySummary={dailySummary} pricingUpdate={pricingUpdate} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Today's performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Products Sold</p>
                    <p className="text-2xl font-bold">{mockProductSummaries.reduce((sum, p) => sum + p.sold, 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Routes Active</p>
                    <p className="text-2xl font-bold">{mockRoutePerformances.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Sale/Route</p>
                    <p className="text-2xl font-bold">
                      ₹{Math.round(mockKPIs.totalSales / mockRoutePerformances.length).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Collection Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        ((mockKPIs.totalCash + mockKPIs.totalCheque + mockKPIs.totalOnlineManual) /
                          mockKPIs.totalSales) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
