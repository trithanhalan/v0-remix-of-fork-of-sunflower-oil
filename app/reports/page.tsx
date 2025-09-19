"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { WhatsAppPreview } from "@/components/whatsapp-preview"
import { generateWhatsAppDailySummary, generateWhatsAppPricingUpdate } from "@/lib/calculations"
import type { DashboardKPIs, ProductSummary, RoutePerformance } from "@/lib/types"

// Mock data for reports
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

export default function ReportsPage() {
  const { toast } = useToast()
  const [selectedDateRange, setSelectedDateRange] = useState("today")

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

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Export Started",
      description: `${reportType} report is being generated...`,
    })

    setTimeout(() => {
      const reportData = reportType === "Daily Summary" ? dailySummary : pricingUpdate
      const blob = new Blob([reportData], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${reportType.toLowerCase().replace(" ", "_")}_${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Complete",
        description: `${reportType} report has been downloaded successfully`,
      })
    }, 1000)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate and export business reports for analysis and sharing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExportReport("Daily Summary")}>
            <Download className="mr-2 h-4 w-4" />
            Export Daily Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList>
          <TabsTrigger value="daily">Daily Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Daily Summary
                </CardTitle>
                <CardDescription>Complete business overview for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Sales</p>
                      <p className="text-2xl font-bold">₹{mockKPIs.totalSales.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Units Sold</p>
                      <p className="text-2xl font-bold">{mockProductSummaries.reduce((sum, p) => sum + p.sold, 0)}</p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => handleExportReport("Daily Summary")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Route Performance
                </CardTitle>
                <CardDescription>Sales performance by route</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {mockRoutePerformances.slice(0, 3).map((route) => (
                      <div key={route.routeId} className="flex justify-between text-sm">
                        <span>{route.routeName}</span>
                        <span className="font-medium">₹{route.salesAmount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleExportReport("Route Performance")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Routes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {/* Updated icon */}
                  <FileText className="h-5 w-5" />
                  Product Analysis
                </CardTitle>
                <CardDescription>Top performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {mockProductSummaries
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 3)
                      .map((product) => (
                        <div key={product.productId} className="flex justify-between text-sm">
                          <span className="truncate">{product.productName.split(" ").slice(0, 2).join(" ")}</span>
                          <span className="font-medium">₹{product.revenue.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleExportReport("Product Analysis")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Today's business metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
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
                  <div>
                    <p className="text-muted-foreground">Active Routes</p>
                    <p className="text-2xl font-bold">{mockRoutePerformances.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Sale/Route</p>
                    <p className="text-2xl font-bold">
                      ₹{Math.round(mockKPIs.totalSales / mockRoutePerformances.length).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock Variances</p>
                    <p className="text-2xl font-bold">{mockKPIs.stockDiscrepancyCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Breakdown</CardTitle>
                <CardDescription>Collection method distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cash</span>
                    <span className="font-medium">₹{mockKPIs.totalCash.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cheque</span>
                    <span className="font-medium">₹{mockKPIs.totalCheque.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Online</span>
                    <span className="font-medium">₹{mockKPIs.totalOnlineManual.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total Collection</span>
                    <span className="font-bold">
                      ₹
                      {(mockKPIs.totalCash + mockKPIs.totalCheque + mockKPIs.totalOnlineManual).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Business Messages</CardTitle>
                <CardDescription>Ready-to-share business summaries</CardDescription>
              </CardHeader>
              <CardContent>
                <WhatsAppPreview dailySummary={dailySummary} pricingUpdate={pricingUpdate} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Download reports in different formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => handleExportReport("Daily Summary")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Daily Summary (TXT)
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => handleExportReport("Pricing Update")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Pricing Update (TXT)
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => handleExportReport("Complete Report")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Complete Report (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
