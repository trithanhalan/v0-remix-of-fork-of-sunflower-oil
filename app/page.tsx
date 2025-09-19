export default function HomePage() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold">Oil Inventory Dashboard</h1>
      <p className="text-muted-foreground mt-2">Welcome to the oil inventory management system.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">View key metrics and performance</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Stock Management</h2>
          <p className="text-sm text-muted-foreground">Track inventory levels</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Sales & Dispatch</h2>
          <p className="text-sm text-muted-foreground">Manage orders and deliveries</p>
        </div>
      </div>
    </div>
  )
}
