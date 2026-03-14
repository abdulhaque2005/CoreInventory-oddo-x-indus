import { createClient } from "@/lib/supabase/server"
import { ProductTable } from "@/components/features/products/product-table"
import { ProductDialog } from "@/components/features/products/product-dialog"

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Products</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage your product catalog and thresholds.</p>
        </div>
        <ProductDialog />
      </div>

      <ProductTable products={products || []} />
    </div>
  )
}
