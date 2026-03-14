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
import { createDelivery } from "@/app/(dashboard)/operations/deliveries/actions"
import { toast } from "sonner"
import { Truck } from "lucide-react"

export function DeliveryDialog({ products, warehouses }: { products: any[], warehouses: any[] }) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await createDelivery(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Delivery created successfully!')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:bg-emerald-500 h-9 px-4 py-2 bg-emerald-600 text-white">
        <Truck className="mr-2 h-4 w-4" /> New Delivery
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-50">
        <DialogHeader>
          <DialogTitle>Create Outgoing Delivery</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Log an outgoing shipment to a customer.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input id="customer" name="customer" required placeholder="e.g. Acme Corp" className="bg-neutral-950 border-neutral-800" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="warehouse_id">Source Warehouse</Label>
            <select 
              id="warehouse_id" 
              name="warehouse_id" 
              required 
              className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            >
              <option value="">Select Source Warehouse...</option>
              {warehouses?.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduled_date">Scheduled Date</Label>
            <Input id="scheduled_date" name="scheduled_date" type="date" required className="bg-neutral-950 border-neutral-800" />
          </div>
          
          <div className="pt-4 border-t border-neutral-800">
            <h4 className="text-sm font-medium mb-3">Line Item (MVP Simplified)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="product_id">Product</Label>
                <select 
                  id="product_id" 
                  name="product_id" 
                  required 
                  className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                >
                  <option value="">Select Product...</option>
                  {products?.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ordered_qty">Qty to Ship</Label>
                <Input id="ordered_qty" name="ordered_qty" type="number" required defaultValue="5" className="bg-neutral-950 border-neutral-800" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Create Delivery
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
