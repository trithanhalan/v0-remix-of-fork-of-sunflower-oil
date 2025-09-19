"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

import { WhatsAppPreview } from "@/components/whatsapp-preview"
import { ProductSummaryTable } from "@/components/product-summary-table"
import { RouteLiveView } from "@/components/route-live-view"
import { DashboardCards } from "@/components/dashboard-cards"

import { generateWhatsAppDailySummary, generateWhatsAppPricingUpdate } from "@/lib/calculations"
import type { DashboardKPIs, ProductSummary, RoutePerformance } from "@/lib/types"

// Mock data (same as dashboard for consistency)
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [reportType, setReportType] = useState<string>("daily")
  const [isGenerating, setIsGenerating] = useState(false)

  const dailySummary = generateWhatsAppDailySummary(
    selectedDate.toLocaleDateString("en-IN"),
    mockProductSummaries,
    mockRoutePerformances,
    mockKPIs,
  )

  const pricingUpdate = generateWhatsAppPricingUpdate(
    selectedDate.toLocaleDateString("en-IN"),
    mockProductSummaries.map((p) => ({
      name: p.productName.split(" ").slice(0, 2).join(" "),
      packLabel: p.productName.split(" ").slice(-2).join(" "),
      unitPrice: p.unitPrice,
    })),
  )

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    toast({
      title: "Report Generated",
      description: `${reportType} report for ${selectedDate.toLocaleDateString("en-IN")} has been generated successfully.`,
    })
  }

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting report in ${format.toUpperCase()} format...`,
    })
  }

  const handlePrintReport = () => {
    window.print()
    toast({
      title: "Print Dialog Opened",
      description: "Report is ready for printing.",
    })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate and export comprehensive business reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrintReport}>
            Print
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Configuration</CardTitle>
          <CardDescription>Select date range and report type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Date:</label>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-transparent">
                {selectedDate.toLocaleDateString("en-IN")}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Report Type:</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Summary</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="product">Product Analysis</SelectItem>
                  <SelectItem value="route">Route Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={() => handleExportReport("pdf")}>
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportReport("excel")}>
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportReport("csv")}>
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          <DashboardCards kpis={mockKPIs} />

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for {selectedDate.toLocaleDateString("en-IN")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Units Sold</p>
                    <p className="text-2xl font-bold">{mockProductSummaries.reduce((sum, p) => sum + p.sold, 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Active Routes</p>
                    <p className="text-2xl font-bold">{mockRoutePerformances.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average Sale/Route</p>
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

            <Card>
              <CardHeader>
                <CardTitle>Report Status</CardTitle>
                <CardDescription>Current report generation status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Summary</span>
                  <Badge variant="default">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Product Analysis</span>
                  <Badge variant="default">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Route Performance</span>
                  <Badge variant="default">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WhatsApp Messages</span>
                  <Badge variant="default">Ready</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Report</CardTitle>
              <CardDescription>Detailed analysis of product sales and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSummaryTable products={mockProductSummaries} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Performance Report</CardTitle>
              <CardDescription>Comprehensive route and vehicle performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <RouteLiveView routes={mockRoutePerformances} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <WhatsAppPreview dailySummary={dailySummary} pricingUpdate={pricingUpdate} />

            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>Pre-configured WhatsApp message templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Available Templates:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Daily Business Summary</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Pricing Update</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Stock Alert</span>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Route Performance</span>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>Sales and performance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-2 bg-muted rounded"></div>
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparative Analysis</CardTitle>
                <CardDescription>Period-over-period comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sales Growth</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      +12.5%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Route Efficiency</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      +8.3%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Product Variance</span>
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      -2.1%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Collection Rate</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      +5.7%
                    </Badge>
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
