import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle } from "lucide-react"
import type { ProductSummary } from "@/lib/types"

interface ProductSummaryTableProps {
  products: ProductSummary[]
}

export function ProductSummaryTable({ products }: ProductSummaryTableProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`

  const getVarianceColor = (variance?: number) => {
    if (variance === undefined || variance === 0) return "text-green-600"
    return variance > 0 ? "text-blue-600" : "text-red-600"
  }

  const getVarianceIcon = (variance?: number) => {
    if (variance === undefined || variance === 0) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    return <AlertTriangle className="h-4 w-4 text-orange-600" />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Product</TableHead>
            <TableHead className="text-right">Opening</TableHead>
            <TableHead className="text-right">Receipts</TableHead>
            <TableHead className="text-right">Dispatched</TableHead>
            <TableHead className="text-right">Returned</TableHead>
            <TableHead className="text-right">Sold</TableHead>
            <TableHead className="text-right">Closing (Exp)</TableHead>
            <TableHead className="text-right">Closing (Act)</TableHead>
            <TableHead className="text-right">Variance</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.productId}>
              <TableCell className="font-medium">{product.productName}</TableCell>
              <TableCell className="text-right">{product.opening}</TableCell>
              <TableCell className="text-right">{product.receipts}</TableCell>
              <TableCell className="text-right">{product.dispatched}</TableCell>
              <TableCell className="text-right">{product.returned}</TableCell>
              <TableCell className="text-right font-medium">{product.sold}</TableCell>
              <TableCell className="text-right">{product.closingExpected}</TableCell>
              <TableCell className="text-right">{product.closingActual ?? "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {getVarianceIcon(product.variance)}
                  <span className={getVarianceColor(product.variance)}>
                    {product.variance !== undefined ? product.variance : "-"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">{formatCurrency(product.unitPrice)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(product.revenue)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
