"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for demonstration
const mockRoutes = [
  {
    id: "ROUTE_UTHUKOTAI",
    name: "Uthukota",
    vehicleId: "2259",
    expected: { cash: 120000, cheque: 15000, online: 8000, discount: 2000 },
    actual: { cash: 118000, cheque: 15000, online: 8000 },
    expenses: [
      { type: "DIESEL", amount: 3500, notes: "Fuel for route" },
      { type: "OTHER", amount: 500, notes: "Toll charges" },
    ],
  },
  {
    id: "ROUTE_ARAKONAM",
    name: "Arakonam",
    vehicleId: "5149",
    expected: { cash: 85000, cheque: 12000, online: 5000, discount: 1500 },
    actual: { cash: 85000, cheque: 12000, online: 5000 },
    expenses: [{ type: "DIESEL", amount: 2800, notes: "Fuel for route" }],
  },
  {
    id: "ROUTE_KALPAKKAM",
    name: "Kalpakkam",
    vehicleId: "4080",
    expected: { cash: 95000, cheque: 8000, online: 3000, discount: 1200 },
    actual: { cash: 96000, cheque: 8000, online: 3000 },
    expenses: [
      { type: "DIESEL", amount: 3200, notes: "Fuel for route" },
      { type: "PARKING", amount: 200, notes: "Parking fees" },
    ],
  },
]

export default function AccountsPage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Calculate totals
  const totals = mockRoutes.reduce(
    (acc, route) => {
      const expectedTotal = route.expected.cash + route.expected.cheque + route.expected.online
      const actualTotal = route.actual.cash + route.actual.cheque + route.actual.online
      const expensesTotal = route.expenses.reduce((sum, exp) => sum + exp.amount, 0)
      const delta = actualTotal - expectedTotal

      return {
        expectedSales: acc.expectedSales + expectedTotal + route.expected.discount,
        expectedCash: acc.expectedCash + route.expected.cash,
        actualCash: acc.actualCash + route.actual.cash,
        totalCheque: acc.totalCheque + route.actual.cheque,
        totalOnline: acc.totalOnline + route.actual.online,
        totalDiscounts: acc.totalDiscounts + route.expected.discount,
        totalExpenses: acc.totalExpenses + expensesTotal,
        totalDelta: acc.totalDelta + delta,
      }
    },
    {
      expectedSales: 0,
      expectedCash: 0,
      actualCash: 0,
      totalCheque: 0,
      totalOnline: 0,
      totalDiscounts: 0,
      totalExpenses: 0,
      totalDelta: 0,
    },
  )

  const netCashInHand = totals.actualCash - totals.totalExpenses
  const expectedCashFromSales = totals.expectedSales - totals.totalCheque - totals.totalOnline - totals.totalDiscounts
  const cashOverShort = netCashInHand - expectedCashFromSales

  const getVarianceColor = (amount: number) => {
    if (amount === 0) return "text-green-600"
    return amount > 0 ? "text-blue-600" : "text-red-600"
  }

  const getVarianceIcon = (amount: number) => {
    if (amount === 0) return <CheckCircle className="h-4 w-4 text-green-600" />
    return <AlertCircle className="h-4 w-4 text-orange-600" />
  }

  const handleSaveReconciliation = () => {
    toast({
      title: "Reconciliation Saved",
      description: "Daily accounts have been reconciled and saved",
    })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground">Daily cash and payment reconciliation</p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-40" />
          <Button onClick={handleSaveReconciliation}>Save Reconciliation</Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="routes">Route Details</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {/* Daily Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totals.expectedSales.toLocaleString("en-IN")}</div>
                <p className="text-xs text-muted-foreground">Expected from invoices</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Collected</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totals.actualCash.toLocaleString("en-IN")}</div>
                <p className="text-xs text-muted-foreground">
                  Expected: ₹{totals.expectedCash.toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Other Payments</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cheque:</span>
                    <span>₹{totals.totalCheque.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Online:</span>
                    <span>₹{totals.totalOnline.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discounts:</span>
                    <span className="text-orange-600">₹{totals.totalDiscounts.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Over/Short</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getVarianceColor(cashOverShort)}`}>
                  ₹{Math.abs(cashOverShort).toLocaleString("en-IN")}
                </div>
                <Badge variant={cashOverShort === 0 ? "default" : "destructive"} className="text-xs">
                  {cashOverShort === 0 ? "BALANCED" : cashOverShort > 0 ? "OVER" : "SHORT"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Reconciliation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Reconciliation</CardTitle>
              <CardDescription>
                Cash flow analysis for {new Date(selectedDate).toLocaleDateString("en-IN")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Expected Cash Flow</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Sales:</span>
                      <span>₹{totals.expectedSales.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Less: Cheque payments</span>
                      <span>-₹{totals.totalCheque.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Less: Online payments</span>
                      <span>-₹{totals.totalOnline.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Less: Discounts given</span>
                      <span>-₹{totals.totalDiscounts.toLocaleString("en-IN")}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Expected Cash:</span>
                      <span>₹{expectedCashFromSales.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Actual Cash Flow</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cash Collected:</span>
                      <span>₹{totals.actualCash.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Less: Expenses paid</span>
                      <span>-₹{totals.totalExpenses.toLocaleString("en-IN")}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Net Cash in Hand:</span>
                      <span>₹{netCashInHand.toLocaleString("en-IN")}</span>
                    </div>
                    <div className={`flex justify-between font-bold ${getVarianceColor(cashOverShort)}`}>
                      <span>Variance:</span>
                      <span>
                        ₹{Math.abs(cashOverShort).toLocaleString("en-IN")} {cashOverShort >= 0 ? "OVER" : "SHORT"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <div className="grid gap-6">
            {mockRoutes.map((route) => {
              const expectedTotal = route.expected.cash + route.expected.cheque + route.expected.online
              const actualTotal = route.actual.cash + route.actual.cheque + route.actual.online
              const expensesTotal = route.expenses.reduce((sum, exp) => sum + exp.amount, 0)
              const routeDelta = actualTotal - expectedTotal

              return (
                <Card key={route.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {route.name} (Vehicle {route.vehicleId})
                      </span>
                      <div className="flex items-center gap-2">
                        {getVarianceIcon(routeDelta)}
                        <Badge variant={routeDelta === 0 ? "default" : "destructive"}>
                          {routeDelta === 0
                            ? "BALANCED"
                            : `₹${Math.abs(routeDelta)} ${routeDelta > 0 ? "OVER" : "SHORT"}`}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <h4 className="font-medium mb-2">Expected</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Cash:</span>
                            <span>₹{route.expected.cash.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cheque:</span>
                            <span>₹{route.expected.cheque.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Online:</span>
                            <span>₹{route.expected.online.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Discount:</span>
                            <span className="text-orange-600">₹{route.expected.discount.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Actual</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Cash:</span>
                            <span>₹{route.actual.cash.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cheque:</span>
                            <span>₹{route.actual.cheque.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Online:</span>
                            <span>₹{route.actual.online.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Expenses</h4>
                        <div className="space-y-1 text-sm">
                          {route.expenses.map((expense, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{expense.type}:</span>
                              <span>₹{expense.amount.toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>₹{expensesTotal.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Expenses Summary</CardTitle>
              <CardDescription>Breakdown of all expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["DIESEL", "TOLL", "PARKING", "OTHER"].map((category) => {
                  const categoryExpenses = mockRoutes.flatMap((route) =>
                    route.expenses.filter((exp) => exp.type === category),
                  )
                  const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)

                  if (categoryTotal === 0) return null

                  return (
                    <div key={category} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{category}</h4>
                        <span className="font-bold">₹{categoryTotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {categoryExpenses.map((expense, index) => {
                          const route = mockRoutes.find((r) => r.expenses.includes(expense))
                          return (
                            <div key={index} className="flex justify-between">
                              <span>
                                {route?.name} ({route?.vehicleId}): {expense.notes}
                              </span>
                              <span>₹{expense.amount.toLocaleString("en-IN")}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
