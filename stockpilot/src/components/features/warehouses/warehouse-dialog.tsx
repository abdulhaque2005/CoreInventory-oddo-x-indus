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
import { createWarehouse } from "@/app/(dashboard)/warehouses/actions"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function WarehouseDialog() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await createWarehouse(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Warehouse created successfully!')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:bg-emerald-500 h-9 px-4 py-2 bg-emerald-600 text-white">
        <Plus className="mr-2 h-4 w-4" /> Add Warehouse
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-50">
        <DialogHeader>
          <DialogTitle>Add New Warehouse</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Create a new warehouse facility to store inventory.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Facility Name</Label>
            <Input id="name" name="name" required className="bg-neutral-950 border-neutral-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Short Code</Label>
            <Input id="code" name="code" required className="bg-neutral-950 border-neutral-800" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" className="bg-neutral-950 border-neutral-800" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_capacity">Max Capacity (items)</Label>
            <Input id="max_capacity" name="max_capacity" type="number" className="bg-neutral-950 border-neutral-800" />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Create Warehouse
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
