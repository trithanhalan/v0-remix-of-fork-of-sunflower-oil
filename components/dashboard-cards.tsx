import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Banknote, CreditCard, Smartphone, TrendingDown, Fuel, Wallet, AlertTriangle } from "lucide-react"
import type { DashboardKPIs } from "@/lib/types"

interface DashboardCardsProps {
  kpis: DashboardKPIs
}

export function DashboardCards({ kpis }: DashboardCardsProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`

  const getCashOverShortColor = (amount: number) => {
    if (amount === 0) return "text-green-600"
    return amount > 0 ? "text-blue-600" : "text-red-600"
  }

  const getCashOverShortLabel = (amount: number) => {
    if (amount === 0) return "BALANCED"
    return amount > 0 ? "CASH OVER" : "CASH SHORT"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(kpis.totalSales)}</div>
          <p className="text-xs text-muted-foreground">Today's revenue</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Mix</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Banknote className="h-3 w-3" />
                Cash
              </span>
              <span className="font-medium">{formatCurrency(kpis.totalCash)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                Cheque
              </span>
              <span className="font-medium">{formatCurrency(kpis.totalCheque)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                Online
              </span>
              <span className="font-medium">{formatCurrency(kpis.totalOnlineManual)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Discounts & Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Discounts</span>
              <span className="font-medium text-orange-600">{formatCurrency(kpis.totalDiscounts)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Fuel className="h-3 w-3" />
                Expenses
              </span>
              <span className="font-medium text-red-600">{formatCurrency(kpis.totalExpenses)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Net Cash</span>
              <span>{formatCurrency(kpis.netCash)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Reconciliation</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${getCashOverShortColor(kpis.cashOverShort)}`}>
              {formatCurrency(Math.abs(kpis.cashOverShort))}
            </div>
            <Badge variant={kpis.cashOverShort === 0 ? "default" : "destructive"} className="text-xs">
              {getCashOverShortLabel(kpis.cashOverShort)}
            </Badge>
            {kpis.stockDiscrepancyCount > 0 && (
              <p className="text-xs text-orange-600">{kpis.stockDiscrepancyCount} stock discrepancies</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
