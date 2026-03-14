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
import { adjustStock } from "@/app/(dashboard)/inventory/actions"
import { toast } from "sonner"
import { Settings2 } from "lucide-react"

export function AdjustmentDialog({ stockLine }: { stockLine: any }) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await adjustStock(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Stock adjusted successfully!')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-800 hover:text-amber-300 h-8 px-3 text-amber-400">
        <Settings2 className="mr-2 h-4 w-4" /> Adjust
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-50">
        <DialogHeader>
          <DialogTitle>Manual Stock Adjustment</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Override the current stock level. This will record a manual adjustment in the move history.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="product_id" value={stockLine.product_id} />
          <input type="hidden" name="warehouse_id" value={stockLine.warehouse_id} />
          {stockLine.location_id && (
            <input type="hidden" name="location_id" value={stockLine.location_id} />
          )}

          <div className="p-3 bg-neutral-950 rounded-md border border-neutral-800 mb-4 text-sm">
            <p className="text-neutral-400">Product: <span className="text-white font-medium">{stockLine.product_name} ({stockLine.sku})</span></p>
            <p className="text-neutral-400 mt-1">Location: <span className="text-white font-medium">{stockLine.warehouse_name} - {stockLine.location_code || 'General'}</span></p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">New Quantity (On Hand)</Label>
            <Input 
              id="quantity" 
              name="quantity" 
              type="number" 
              defaultValue={stockLine.on_hand_qty} 
              required 
              className="bg-neutral-950 border-neutral-800" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Adjustment</Label>
            <Input 
              id="reason" 
              name="reason" 
              placeholder="e.g. Inventory count discrepancy" 
              required 
              className="bg-neutral-950 border-neutral-800" 
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Confirm Adjustment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
