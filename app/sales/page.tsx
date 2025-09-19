"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, ShoppingCart, Receipt, Banknote, CreditCard, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for demonstration
const mockRoutes = [
  { id: "ROUTE_UTHUKOTAI", name: "Uthukota" },
  { id: "ROUTE_ARAKONAM", name: "Arakonam" },
  { id: "ROUTE_KALPAKKAM", name: "Kalpakkam" },
]

const mockVehicles = [
  { id: "VH_2259", number: "2259" },
  { id: "VH_5149", number: "5149" },
  { id: "VH_4080", number: "4080" },
]

const mockShops = [
  { id: "SHOP_001", name: "Sri Maruthi Stores", routeId: "ROUTE_UTHUKOTAI" },
  { id: "SHOP_002", name: "Lakshmi Oil Depot", routeId: "ROUTE_UTHUKOTAI" },
  { id: "SHOP_003", name: "Arakonam Supermart", routeId: "ROUTE_ARAKONAM" },
]

const mockProducts = [
  { id: "SF_30KG", name: "Sunflower 30kg Can", unitPrice: 3900, onTruck: 12 },
  { id: "SF_15L", name: "Sunflower 15L Tin", unitPrice: 1768, onTruck: 25 },
  { id: "PS_15L", name: "Palmstar 15L Tin", unitPrice: 1292, onTruck: 18 },
  { id: "SF_1L", name: "Sunflower 1L Pouch", unitPrice: 118, onTruck: 50 },
]

interface InvoiceLine {
  productId: string
  productName: string
  qty: number
  unitPrice: number
  lineTotal: number
}

interface Payment {
  type: "CASH" | "CHEQUE" | "ONLINE_MANUAL"
  amount: number
  reference?: string
  bankName?: string
  chequeNumber?: string
}

export default function SalesPage() {
  const { toast } = useToast()
  const [selectedRoute, setSelectedRoute] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedShop, setSelectedShop] = useState("")
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [cashAmount, setCashAmount] = useState("")
  const [chequeAmount, setChequeAmount] = useState("")
  const [onlineAmount, setOnlineAmount] = useState("")

  const filteredShops = mockShops.filter((shop) => shop.routeId === selectedRoute)

  const billedAmount = invoiceLines.reduce((sum, line) => sum + line.lineTotal, 0)
  const totalReceived = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const discountAmount = billedAmount - totalReceived

  const addProductLine = (product: (typeof mockProducts)[0]) => {
    const existingLine = invoiceLines.find((line) => line.productId === product.id)

    if (existingLine) {
      updateQuantity(product.id, existingLine.qty + 1)
    } else {
      const newLine: InvoiceLine = {
        productId: product.id,
        productName: product.name,
        qty: 1,
        unitPrice: product.unitPrice,
        lineTotal: product.unitPrice,
      }
      setInvoiceLines([...invoiceLines, newLine])
    }
  }

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setInvoiceLines(invoiceLines.filter((line) => line.productId !== productId))
      return
    }

    setInvoiceLines(
      invoiceLines.map((line) =>
        line.productId === productId ? { ...line, qty: newQty, lineTotal: newQty * line.unitPrice } : line,
      ),
    )
  }

  const addPayment = (type: Payment["type"]) => {
    let amount = 0
    let reference = ""

    switch (type) {
      case "CASH":
        amount = Number.parseFloat(cashAmount) || 0
        setCashAmount("")
        break
      case "CHEQUE":
        amount = Number.parseFloat(chequeAmount) || 0
        reference = `Cheque #${Date.now()}`
        setChequeAmount("")
        break
      case "ONLINE_MANUAL":
        amount = Number.parseFloat(onlineAmount) || 0
        reference = `Online Ref: ${Date.now()}`
        setOnlineAmount("")
        break
    }

    if (amount > 0) {
      setPayments([...payments, { type, amount, reference }])
    }
  }

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index))
  }

  const handleIssueInvoice = () => {
    if (!selectedRoute || !selectedVehicle || !selectedShop || invoiceLines.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select route, vehicle, shop and add products",
        variant: "destructive",
      })
      return
    }

    // Simulate invoice creation
    toast({
      title: "Invoice Created",
      description: `Invoice issued for ${billedAmount.toLocaleString("en-IN")} with ${discountAmount > 0 ? `₹${discountAmount} discount` : "no discount"}`,
    })

    // Reset form
    setInvoiceLines([])
    setPayments([])
    setSelectedShop("")
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales POS</h2>
          <p className="text-muted-foreground">Mobile-first point of sale for field sales</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Invoice Creation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route & Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Route & Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="route">Route</Label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoutes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="shop">Shop</Label>
                <Select value={selectedShop} onValueChange={setSelectedShop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shop" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredShops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
              <CardDescription>Select products to add to invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => addProductLine(product)}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{product.unitPrice.toLocaleString("en-IN")} • {product.onTruck} on truck
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Lines */}
          {invoiceLines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoiceLines.map((line) => (
                    <div key={line.productId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{line.productName}</p>
                        <p className="text-sm text-muted-foreground">₹{line.unitPrice.toLocaleString("en-IN")} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(line.productId, line.qty - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{line.qty}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(line.productId, line.qty + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium">₹{line.lineTotal.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Payment & Summary */}
        <div className="space-y-6">
          {/* Invoice Total */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Total</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-lg">
                <span>Billed Amount:</span>
                <span className="font-bold">₹{billedAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Received:</span>
                <span>₹{totalReceived.toLocaleString("en-IN")}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span>Discount:</span>
                <span className={discountAmount > 0 ? "text-orange-600" : "text-green-600"}>
                  ₹{Math.abs(discountAmount).toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Entry */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cash Payment */}
              <div className="flex gap-2">
                <Input
                  placeholder="Cash amount"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  type="number"
                />
                <Button onClick={() => addPayment("CASH")} variant="outline">
                  <Banknote className="h-4 w-4 mr-1" />
                  Cash
                </Button>
              </div>

              {/* Cheque Payment */}
              <div className="flex gap-2">
                <Input
                  placeholder="Cheque amount"
                  value={chequeAmount}
                  onChange={(e) => setChequeAmount(e.target.value)}
                  type="number"
                />
                <Button onClick={() => addPayment("CHEQUE")} variant="outline">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Cheque
                </Button>
              </div>

              {/* Online Payment */}
              <div className="flex gap-2">
                <Input
                  placeholder="Online amount"
                  value={onlineAmount}
                  onChange={(e) => setOnlineAmount(e.target.value)}
                  type="number"
                />
                <Button onClick={() => addPayment("ONLINE_MANUAL")} variant="outline">
                  <Smartphone className="h-4 w-4 mr-1" />
                  Online
                </Button>
              </div>

              {/* Payment List */}
              {payments.length > 0 && (
                <div className="space-y-2">
                  <Label>Recorded Payments:</Label>
                  {payments.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{payment.type}</Badge>
                        <span>₹{payment.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removePayment(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issue Invoice */}
          <Button className="w-full" size="lg" onClick={handleIssueInvoice} disabled={invoiceLines.length === 0}>
            <Receipt className="h-4 w-4 mr-2" />
            Issue Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}
