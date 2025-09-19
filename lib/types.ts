// Dashboard and business logic types for the oil inventory system

export interface DashboardKPIs {
  totalSales: number
  totalCash: number
  totalCheque: number
  totalOnlineManual: number
  totalDiscounts: number
  totalExpenses: number
  netCash: number
  cashOverShort: number
  stockDiscrepancyCount: number
}

export interface ProductSummary {
  productId: string
  productName: string
  opening: number
  receipts: number
  dispatched: number
  returned: number
  sold: number
  closingExpected: number
  closingActual?: number
  variance?: number
  unitPrice: number
  revenue: number
}

export interface RoutePerformance {
  routeId: string
  routeName: string
  vehicleId: string
  dispatched: number
  sold: number
  onTruckRemaining: number
  returns: number
  salesAmount: number
}

export interface PaymentBreakdown {
  cash: number
  cheque: number
  onlineManual: number
  discount: number
}

export interface ExpenseEntry {
  type: "DIESEL" | "TOLL" | "PARKING" | "OTHER"
  amount: number
  notes: string
  routeId?: string
  vehicleId?: string
}

export interface InvoiceLineItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface SalesTransaction {
  id: string
  invoiceNumber: string
  shopId: string
  shopName: string
  routeId: string
  vehicleId: string
  items: InvoiceLineItem[]
  payments: PaymentBreakdown
  totalAmount: number
  discountAmount: number
  timestamp: Date
  salespersonId: string
}

export interface StockMovement {
  productId: string
  productName: string
  movementType: "OPENING" | "RECEIPT" | "DISPATCH" | "SALE" | "RETURN"
  quantity: number
  reference?: string
  timestamp: Date
}

export interface CashReconciliation {
  routeId: string
  routeName: string
  vehicleId: string
  expectedCash: number
  actualCash: number
  variance: number
  expenses: ExpenseEntry[]
  reconciled: boolean
  reconciledBy?: string
  reconciledAt?: Date
}
