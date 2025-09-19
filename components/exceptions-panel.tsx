import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, XCircle, Clock, Package, DollarSign } from "lucide-react"

interface Exception {
  id: string
  type: "route_mismatch" | "high_discount" | "stock_variance" | "day_not_closed"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  value?: string
}

interface ExceptionsPanelProps {
  exceptions: Exception[]
}

export function ExceptionsPanel({ exceptions }: ExceptionsPanelProps) {
  const getIcon = (type: Exception["type"]) => {
    switch (type) {
      case "route_mismatch":
        return <XCircle className="h-4 w-4" />
      case "high_discount":
        return <DollarSign className="h-4 w-4" />
      case "stock_variance":
        return <Package className="h-4 w-4" />
      case "day_not_closed":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: Exception["severity"]) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  if (exceptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Exceptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No exceptions found</p>
            <p className="text-sm">All systems operating normally</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Exceptions
          <Badge variant="destructive" className="ml-auto">
            {exceptions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exceptions.map((exception) => (
          <Alert key={exception.id} className="p-3">
            <div className="flex items-start gap-3">
              {getIcon(exception.type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{exception.title}</h4>
                  <Badge variant={getSeverityColor(exception.severity)} className="text-xs">
                    {exception.severity.toUpperCase()}
                  </Badge>
                </div>
                <AlertDescription className="text-xs">{exception.description}</AlertDescription>
                {exception.value && <p className="text-xs font-mono bg-muted px-2 py-1 rounded">{exception.value}</p>}
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
