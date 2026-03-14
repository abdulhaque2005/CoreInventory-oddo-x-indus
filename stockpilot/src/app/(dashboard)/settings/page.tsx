'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useUser } from '@/components/providers/user-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Warehouse, MapPin, Lock, Save, Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { role } = useUser()
  const isAppUser = role === 'admin'

  const warehouses = useAppStore(state => state.warehouses)
  const locations = useAppStore(state => state.locations)
  const updateWarehouse = useAppStore(state => state.updateWarehouse)
  const addLocation = useAppStore(state => state.addLocation)

  const [activeTab, setActiveTab] = useState<'warehouses' | 'locations'>('warehouses')
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(null)
  const [warehouseEdits, setWarehouseEdits] = useState<Record<string, string>>({})

  // Form states for adding a new location
  const [newLocName, setNewLocName] = useState('')
  const [newLocCode, setNewLocCode] = useState('')
  const [newLocWarehouse, setNewLocWarehouse] = useState(warehouses[0]?.id || '')

  const handleSaveWarehouse = (id: string) => {
    if (warehouseEdits[id] !== undefined) {
      updateWarehouse(id, { name: warehouseEdits[id] })
      toast.success('Warehouse updated!')
    }
    setEditingWarehouseId(null)
  }

  const handleAddLocation = () => {
    if (!newLocName || !newLocCode) {
      toast.error('Please fill in all location fields.')
      return
    }
    addLocation({
      id: `l_${Date.now()}`,
      name: newLocName,
      shortCode: newLocCode,
      warehouseId: newLocWarehouse
    })
    toast.success('Location added!')
    setNewLocName('')
    setNewLocCode('')
  }

  if (!isAppUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="p-5 rounded-full bg-white/5 border border-white/10">
          <Lock className="h-8 w-8 text-neutral-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Restricted</h2>
        <p className="text-neutral-400 text-sm max-w-sm text-center">
          This section is only available to App Administrators. Please contact your admin to modify warehouse settings.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">Configure your warehouses and storage locations.</p>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'warehouses'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          Warehouses
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'locations'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Locations
        </button>
      </div>

      {/* Warehouses Tab */}
      {activeTab === 'warehouses' && (
        <div className="space-y-4">
          {warehouses.map(warehouse => (
            <div key={warehouse.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <Warehouse className="h-5 w-5 text-amber-400" />
                  </div>
                  {editingWarehouseId === warehouse.id ? (
                    <div className="flex gap-3 flex-1">
                      <Input
                        value={warehouseEdits[warehouse.id] ?? warehouse.name}
                        onChange={(e) => setWarehouseEdits({...warehouseEdits, [warehouse.id]: e.target.value})}
                        className="bg-neutral-900 border-emerald-500/50 text-white max-w-xs"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-white">{warehouse.name}</p>
                      <p className="text-sm text-neutral-400">{warehouse.address} &bull; Code: {warehouse.shortCode}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingWarehouseId === warehouse.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEditingWarehouseId(null)} className="bg-transparent border-white/10 text-neutral-400">Cancel</Button>
                      <Button size="sm" onClick={() => handleSaveWarehouse(warehouse.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                        <Save className="w-4 h-4 mr-1" /> Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditingWarehouseId(warehouse.id)} className="bg-transparent border-white/10 hover:bg-white/5 text-neutral-300">
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {locations.map(location => {
              const warehouse = warehouses.find(w => w.id === location.warehouseId)
              return (
                <div key={location.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{location.name}</p>
                    <p className="text-sm text-neutral-400">Code: {location.shortCode} &bull; {warehouse?.name || 'Unknown Warehouse'}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add New Location Form */}
          <div className="bg-white/5 border border-dashed border-white/20 p-6 rounded-2xl">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              Add New Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block uppercase tracking-wider">Location Name</label>
                <Input
                  placeholder="e.g. WH/Shelf-A1"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="bg-neutral-900 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block uppercase tracking-wider">Short Code</label>
                <Input
                  placeholder="e.g. S-A1"
                  value={newLocCode}
                  onChange={(e) => setNewLocCode(e.target.value)}
                  className="bg-neutral-900 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block uppercase tracking-wider">Warehouse</label>
                <select
                  value={newLocWarehouse}
                  onChange={(e) => setNewLocWarehouse(e.target.value)}
                  className="w-full h-10 rounded-md border border-white/10 bg-neutral-900 px-3 text-sm text-white"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button onClick={handleAddLocation} className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Location
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
