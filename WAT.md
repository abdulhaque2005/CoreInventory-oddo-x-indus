# 🤖 WAT (Worker-Action-Trigger) Framework

The WAT framework powers the StockPilot automation engine, enabling background evaluation of inventory rules and automatic action execution.

## 🏗️ Core Concept
StockPilot uses a **Loop → Detect → Execute** cycle.

### 1. Workers (W)
Background processes that evaluate the state of the warehouse.
- **DeadStockWorker**: Scans for items with no `stock_moves` in 60 days.
- **AnomalyWorker**: Calculates moving averages and detects deviations > 30%.
- **AutomationWorker**: Periodically processes `automation_rules` table.

### 2. Actions (A)
Encapsulated tasks performed by the system.
- `SUGGEST_RESTOCK`: Injects a suggestion into the AI feed/Dashboard.
- `MARK_DEAD_INVENTORY`: Updates product tags or status.
- `CREATE_ALERT`: Adds a record to the `alerts` table.
- `NOTIFY_MANAGER`: Triggers a high-priority system notification.

### 3. Triggers (T)
Events that kick off Workers or Actions.
- **Time-based**: Every 15 minutes (Cron).
- **Event-based**: `INSERT` on `stock_moves` triggers an immediate anomaly check for that SKU.
- **Manual**: User clicks "Run Diagnostic" in Dashboard.

---

## 📜 Example Rules
Stored in `automation_rules` table:

| Name | Trigger | Condition | Action |
|------|---------|-----------|--------|
| Low Stock Refill | `on_hand_qty < reorder_level` | `predicted_demand > on_hand` | `SUGGEST_RESTOCK` |
| Dead Zone Detection | `last_movement > 60 days` | `ALWAYS` | `MARK_DEAD_INVENTORY` |
| High Value Drift | `stock_adjustment > 500$` | `role != manager` | `NOTIFY_MANAGER` |

---

## 🔒 Security & Confirmation
All AI-generated actions from natural language commands MUST enter a **Pending Confirmation** state:
1. AI extracts intent (e.g., "Receive 10 units").
2. Intent is mapped to a WAT Action.
3. System logs record to `ai_action_logs` with `execution_status = 'pending'`.
4. User clicks **[Execute]** in the HUD UI to commit to DB.