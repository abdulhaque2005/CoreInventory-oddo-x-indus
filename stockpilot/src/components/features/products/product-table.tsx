'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductDialog } from "./product-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteProduct } from "@/app/(dashboard)/products/actions"
import { toast } from "sonner"

export function ProductTable({ products }: { products: any[] }) {
  
  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Product deleted successfully")
      }
    }
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <Table>
        <TableHeader className="bg-white/5 border-b border-white/10">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase">SKU</TableHead>
            <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase">Name</TableHead>
            <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase">Category</TableHead>
            <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase text-right">Price</TableHead>
            <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase text-right">Reorder Lvl</TableHead>
            <TableHead className="text-neutral-400 font-medium tracking-wide text-xs uppercase text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
              <TableCell className="font-medium text-neutral-300 group-hover:text-amber-300 transition-colors">{product.sku}</TableCell>
              <TableCell className="text-white font-medium">{product.name}</TableCell>
              <TableCell>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-neutral-300 border border-white/10 shadow-sm backdrop-blur-sm">
                  {product.category || 'None'}
                </span>
              </TableCell>
              <TableCell className="text-right text-emerald-400 font-medium">
                ${product.unit_price?.toFixed(2)}
              </TableCell>
              <TableCell className="text-right text-amber-500 font-medium">
                {product.reorder_level}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ProductDialog product={product} />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                No products found. Add your first product above.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
