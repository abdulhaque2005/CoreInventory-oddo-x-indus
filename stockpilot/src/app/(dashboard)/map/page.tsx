import { createClient } from "@/lib/supabase/server"
import { WarehouseMap } from "@/components/features/map/warehouse-map"

export default async function MapPage() {
  const supabase = await createClient()

  // Fetch warehouses
  const { data: warehouses } = await supabase.from('warehouses').select('*').order('name')

  // Fetch locations
  const { data: locations } = await supabase.from('locations').select('*')

  // Fetch stock data to determine capacity utilization per location
  const { data: stockLines } = await supabase.from('inventory_with_availability').select('*')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Visual Warehouse Map</h1>
        <p className="text-neutral-400 text-sm mt-1">Real-time floor plan showing location capacity and utilization.</p>
      </div>

      <WarehouseMap 
        warehouses={warehouses || []} 
        locations={locations || []} 
        stockLines={stockLines || []} 
      />
    </div>
  )
}
