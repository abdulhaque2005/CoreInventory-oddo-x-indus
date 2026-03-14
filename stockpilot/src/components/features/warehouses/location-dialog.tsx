'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createLocation } from "@/app/(dashboard)/warehouses/actions"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function LocationDialog({ warehouseId }: { warehouseId: string }) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await createLocation(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Location added successfully!')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none h-8 px-3 border border-neutral-700 hover:bg-neutral-800 bg-transparent">
        <Plus className="mr-2 h-4 w-4" /> Add Location
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-50">
        <DialogHeader>
          <DialogTitle>Add Warehouse Location</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Add a specific racking or floor location within this warehouse.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="warehouse_id" value={warehouseId} />
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input id="name" name="name" required placeholder="e.g. A1 Rack" className="bg-neutral-950 border-neutral-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Location Code</Label>
            <Input id="code" name="code" required placeholder="e.g. WH01-A1" className="bg-neutral-950 border-neutral-800" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location_type">Type</Label>
              <Input id="location_type" name="location_type" defaultValue="rack" className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_capacity">Capacity</Label>
              <Input id="max_capacity" name="max_capacity" type="number" className="bg-neutral-950 border-neutral-800" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Add Location
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
