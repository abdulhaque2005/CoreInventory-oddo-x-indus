import { createClient } from "@/lib/supabase/server"
import { WarehouseDialog } from "@/components/features/warehouses/warehouse-dialog"
import { LocationDialog } from "@/components/features/warehouses/location-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Box } from "lucide-react"

export default async function WarehousesPage() {
  const supabase = await createClient()
  
  // Fetch warehouses
  const { data: warehouses } = await supabase
    .from('warehouses')
    .select('*')
    .order('name', { ascending: true })

  // Fetch locations
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .order('code', { ascending: true })

  // Group locations by warehouse
  const locationsByWarehouse = locations?.reduce((acc: any, loc: any) => {
    if (!acc[loc.warehouse_id]) acc[loc.warehouse_id] = []
    acc[loc.warehouse_id].push(loc)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Warehouses & Locations</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage physical storage facilities and internal mapping.</p>
        </div>
        <WarehouseDialog />
      </div>

      <div className="grid gap-6">
        {warehouses?.map((wh) => (
          <Card key={wh.id} className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-amber-400">{wh.name} <span className="text-sm font-normal text-neutral-500 ml-2">({wh.code})</span></CardTitle>
                <div className="flex items-center text-sm text-neutral-400 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {wh.city}, {wh.state}
                </div>
              </div>
              <LocationDialog warehouseId={wh.id} />
            </CardHeader>
            <CardContent>
              <div className="mt-4 border border-neutral-800 rounded-md overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-neutral-950/50 text-neutral-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Location Code</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium text-right">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {locationsByWarehouse?.[wh.id]?.map((loc: any) => (
                      <tr key={loc.id} className="hover:bg-neutral-800/30">
                        <td className="px-4 py-3 font-medium text-neutral-300">{loc.code}</td>
                        <td className="px-4 py-3">{loc.name}</td>
                        <td className="px-4 py-3 capitalize">{loc.location_type}</td>
                        <td className="px-4 py-3 text-right text-emerald-400">{loc.max_capacity}</td>
                      </tr>
                    ))}
                    {!locationsByWarehouse?.[wh.id] && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                          <Box className="h-8 w-8 mx-auto mb-2 opacity-20" />
                          No locations defined for this warehouse.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
