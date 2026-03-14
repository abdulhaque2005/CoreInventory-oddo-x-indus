import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings2, Play, AlertCircle } from "lucide-react"

export default async function AutomationPage() {
  const supabase = await createClient()

  // Fetch automation rules
  const { data: rules } = await supabase
    .from('automation_rules')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Automation Rules</h1>
          <p className="text-neutral-400 text-sm mt-1">Configure automated workflows and alerts (MVP Layout).</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm font-medium flex items-center">
          <Settings2 className="w-4 h-4 mr-2" />
          New Rule
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Mockup Rules for MVP display */}
        
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg text-white">Low Stock Auto-Reorder</CardTitle>
                <CardDescription className="text-neutral-400 mt-1">Triggers when available stock falls below reorder level.</CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              <div className="flex items-center text-sm text-neutral-300">
                <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                Condition: Stock &lt; Reorder Level
              </div>
              <div className="flex items-center text-sm text-neutral-300">
                <Play className="w-4 h-4 mr-2 text-amber-400" />
                Action: Create Draft Receipt
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg text-white">Daily Summary Alert</CardTitle>
                <CardDescription className="text-neutral-400 mt-1">Sends a daily email with pending deliveries.</CardDescription>
              </div>
              <Badge variant="outline" className="bg-neutral-800 text-neutral-400 border-neutral-700">Paused</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              <div className="flex items-center text-sm text-neutral-300">
                <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                Condition: Schedule (Daily 8:00 AM)
              </div>
              <div className="flex items-center text-sm text-neutral-300">
                <Play className="w-4 h-4 mr-2 text-amber-400" />
                Action: Send Email Alert
              </div>
            </div>
          </CardContent>
        </Card>

        {rules?.map((rule) => (
          <Card key={rule.id} className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-white">{rule.name}</CardTitle>
                  <CardDescription className="text-neutral-400 mt-1">{rule.description}</CardDescription>
                </div>
                <Badge variant="outline" className={rule.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-neutral-800 text-neutral-400 border-neutral-700"}>
                  {rule.is_active ? 'Active' : 'Paused'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-3 mt-2">
                <div className="flex items-center text-sm text-neutral-300">
                  <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                  Condition: {rule.condition_type}
                </div>
                <div className="flex items-center text-sm text-neutral-300">
                  <Play className="w-4 h-4 mr-2 text-amber-400" />
                  Action: {rule.action_type}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  )
}
