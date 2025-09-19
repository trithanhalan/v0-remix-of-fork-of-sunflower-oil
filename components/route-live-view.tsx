import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Truck, DollarSign } from "lucide-react"
import type { RoutePerformance } from "@/lib/types"

interface RouteLiveViewProps {
  routes: RoutePerformance[]
}

export function RouteLiveView({ routes }: RouteLiveViewProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`

  const getSalesProgress = (sold: number, dispatched: number) => {
    if (dispatched === 0) return 0
    return Math.round((sold / dispatched) * 100)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {routes.map((route) => (
        <Card key={`${route.routeId}-${route.vehicleId}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                {route.routeName}
              </span>
              <Badge variant="outline">{route.vehicleId}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Dispatched</p>
                <p className="font-medium">{route.dispatched} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sold</p>
                <p className="font-medium text-green-600">{route.sold} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">On Truck</p>
                <p className="font-medium text-blue-600">{route.onTruckRemaining} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Returns</p>
                <p className="font-medium text-orange-600">{route.returns} units</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Sales Progress</span>
                <span>{getSalesProgress(route.sold, route.dispatched)}%</span>
              </div>
              <Progress value={getSalesProgress(route.sold, route.dispatched)} className="h-2" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Sales Amount
              </span>
              <span className="font-medium">{formatCurrency(route.salesAmount)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
