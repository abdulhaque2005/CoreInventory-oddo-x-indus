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
import { createProduct, updateProduct } from "@/app/(dashboard)/products/actions"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export function ProductDialog({ product }: { product?: any }) {
  const [open, setOpen] = useState(false)
  const isEditing = !!product

  async function handleSubmit(formData: FormData) {
    let result
    if (isEditing) {
      result = await updateProduct(product.id, formData)
    } else {
      result = await createProduct(formData)
    }

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully!`)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isEditing ? (
          <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:bg-neutral-800 hover:text-neutral-50 h-8 px-3">Edit</span>
        ) : (
          <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none hover:bg-emerald-500 h-9 px-4 py-2 bg-emerald-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-50">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription className="text-neutral-400">
            {isEditing ? 'Make changes to your product here.' : 'Fill in the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" defaultValue={product?.name} required className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" defaultValue={product?.sku} required className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" defaultValue={product?.category} className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price ($)</Label>
              <Input id="unit_price" name="unit_price" type="number" step="0.01" defaultValue={product?.unit_price} className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorder_level">Reorder Level</Label>
              <Input id="reorder_level" name="reorder_level" type="number" defaultValue={product?.reorder_level} className="bg-neutral-950 border-neutral-800" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              {isEditing ? 'Save changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
