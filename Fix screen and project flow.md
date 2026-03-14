You are improving an existing Warehouse Management System (WMS) React application.
Do NOT rebuild from scratch. Optimize and fix the project flow only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A warehouse management app with the following screens already built:
1. Login / Signup
2. Dashboard
3. Stock
4. Receipts List
5. Receipt Detail
6. Delivery List
7. Delivery Detail
8. Move History List
9. Warehouse Settings
10. Location Settings

Your job is to wire up, fix, and optimize ALL flows between these screens
so the app behaves like a real production WMS tool.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW 1 — AUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Login page is the entry point at route /login
- Two user types: App User (full access) and Sub User (no Settings access)
- On successful login → redirect to /dashboard
- If already logged in and user visits /login → redirect to /dashboard
- If unauthenticated user visits any protected route → redirect to /login
- On logout → clear session/context and redirect to /login
- Sub User: hide Settings link from top nav entirely

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW 2 — DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dashboard loads today's data by default on mount.

Four summary cards must be clickable and route correctly:
  - Receipt card → /receipts (Receipts List)
  - Stock card → /stock (Stock screen)
  - Move History card → /move-history (Move History List)
  - Delivery card → /delivery (Delivery List)

Dashboard data behavior:
  - Operations schedule date defaults to today
  - Settings schedule date defaults to today
  - Show polling/loading state while stock counts are being "fetched"
    (simulate with a 1.5s setTimeout then reveal numbers)

Top nav links must route:
  - Dashboard → /dashboard
  - Operations → /receipts (defaults to Receipts list)
  - Products → /stock
  - Move History → /move-history
  - Settings → /settings/warehouse (first settings tab)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW 3 — RECEIPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route: /receipts → Receipts List (default List view, not Kanban)

List view columns: Reference | From | To | Scheduled Date | Status

List behavior:
  - Search bar filters by Reference OR contact name in real time
  - Toggle button switches between List view and Kanban view
  - Each row is clickable → routes to /receipts/:id

Status badge colors:
  - Ready → green
  - Draft → gray
  - Done → blue
  - Cancelled → red

On the Receipt Detail screen (/receipts/:id):
  - Status stepper at top: Draft → Ready → Store (highlight current step)
  - Header fields: Date, Responsible (logged-in user pre-filled), Operation Type
  - Products table: columns Product | Quantity with an "Add Product" row at bottom
  - Three action buttons: Validate | Print | Cancel
  
  Validate button flow:
    1. Button shows loading spinner + "Validating..." for 2 seconds (polling simulation)
    2. Status updates from "Ready" to "Store" / "Done"
    3. Stock quantities for listed products update in global state (on hand += qty)
    4. Show success toast: "Receipt validated. Stock updated."
    5. Redirect back to /receipts after 1 second

  Cancel button:
    - Sets status to Cancelled
    - Redirects to /receipts

  Print button:
    - Opens browser print dialog (window.print())

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW 4 — DELIVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route: /delivery → Delivery List (default List view)

List view columns: Reference | From | To | Scheduled Date | Status

List behavior:
  - Search bar filters by Reference OR contact name in real time
  - Toggle between List view and Kanban view
  - Each row is clickable → routes to /delivery/:id

On the Delivery Detail screen (/delivery/:id):
  - Status stepper: Draft → Settings → Done (highlight current step)
  - Header fields: Operation Type, Responsible, Scheduled Date
  - Products table: Product | Quantity | "Add Product" row
  - Three action buttons: Validate | Settings | Done

  Validate button flow:
    1. Button shows loading spinner + "Validating..." for 2 seconds
    2. Status moves to "Done"
    3. Stock quantities for listed products DECREASE in global state (on hand -= qty)
    4. Show success toast: "Delivery validated. Stock deducted."
    5. Redirect to /delivery after 1 second

  Settings button:
    - Opens an inline panel or modal showing delivery settings (editable fields:
      Scheduled Date, Responsible, Operation Type)

  Done button:
    - Only active when status is already "Done"
    - Marks delivery as complete and redirects to /delivery

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW 5 — STOCK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route: /stock

Table columns: Product | Per Unit Cost | On Hand | Free to Use

- "Free to Use" = On Hand minus any reserved quantities
- User can click any row to edit the On Hand value inline
  (click cell → becomes input → blur or Enter saves)
- Stock values are stored in global state (React Context or Zustand)
- Stock values must reflect changes from validated Receipts (+qty)
  and validated Deliveries (-qty) automatically
- Show a "Last updated" timestamp that refreshes on every stock change

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW 6 — MOVE HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route: /move-history → Move History List (default List view)

List columns: Date/Time | From (location) | To (location) | Price | Quantity | Status

List behavior:
  - Search bar filters by Reference OR contact name
    → matching product name highlights in GREEN
    → matching move history reference highlights in BOLD
  - Toggle between List and Kanban view
  - Each row clickable → /move-history/:id

On Move History Detail (/move-history/:id):
  - Show: Reference, From location, To location, Price, Quantity, Status
  - If a reference links to multiple products → display ALL products listed
  - Status badge displayed prominently
  - Read-only view (no actions, this is history)

Move history entries are automatically created when:
  - A Receipt is validated → creates a move from Supplier → Warehouse location
  - A Delivery is validated → creates a move from Warehouse location → Customer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLOW 7 — SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route: /settings → redirects to /settings/warehouse by default

Settings has two sub-tabs in a secondary nav:
  - Warehouse (/settings/warehouse)
  - Location (/settings/location)

Only visible/accessible to App User (not Sub User).

Warehouse screen (/settings/warehouse):
  - Form fields: Name (text) | Short Code (text) | Address (textarea)
  - Save button → saves to global state + shows success toast
  - "This page contains the warehouse details & location."

Location screen (/settings/location):
  - Form fields: Name (text) | Short Code (text) | Warehouse (dropdown — 
    populated from warehouses saved in global state)
  - Multiple locations can be added (list of existing locations shown below form)
  - Add button → appends new location to the list
  - "This holds the multiple locations of warehouses, rooms, etc."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL STATE REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use React Context (or Zustand if already in project) for:

1. auth: { isLoggedIn, userType: 'app' | 'sub', userName }
2. stock: [{ id, product, perUnitCost, onHand, reserved }]
3. receipts: [{ id, reference, from, to, scheduledDate, status, products: [], responsible }]
4. deliveries: [{ id, reference, from, to, scheduledDate, status, products: [], responsible }]
5. moveHistory: [{ id, reference, from, to, price, quantity, status, date, products: [] }]
6. warehouses: [{ id, name, shortCode, address }]
7. locations: [{ id, name, shortCode, warehouseId }]

All state persists within the session (no page refresh handling needed).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UX RULES TO APPLY THROUGHOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Every list screen defaults to List View (not Kanban)
2. Every list has a real-time search/filter bar at the top
3. Every list has a List/Kanban view toggle button (top right)
4. Every detail screen has a breadcrumb: e.g. "Dashboard > Receipts > WH/IN/00001"
5. Every form pre-fills "Responsible" with the logged-in user's name
6. All action buttons (Validate, Cancel, Save) show a loading spinner during async ops
7. Success and error states show as toast notifications (top-right, auto-dismiss 3s)
8. All status values use consistent color-coded badges:
     Ready → green | Draft → gray | Done → blue | Cancelled → red
9. Back button on every detail screen returns to the list
10. Empty states: if a list has no items, show a centered empty state illustration + message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOCK DATA TO SEED ON APP LOAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seed the following mock data into global state on initialization:

Products / Stock:
  - Bolt (M8x20)       | cost: 0.15  | on hand: 5000 | reserved: 200
  - Yoke               | cost: 800   | on hand: 30   | reserved: 10
  - [add 3 more products of your choice]

Receipts (3 items):
  - WH/IN/00001 | From: Vendor A | To: WH/Stock  | Date: today    | Status: Ready
  - WH/IN/00002 | From: Vendor B | To: WH/Stock  | Date: tomorrow | Status: Draft
  - WH/IN/00003 | From: Vendor C | To: WH/Stock  | Date: today-1  | Status: Done

Deliveries (3 items):
  - WH/OUT/00001 | From: WH/Stock | To: Customer X | Date: today    | Status: Ready
  - WH/OUT/00002 | From: WH/Stock | To: Customer Y | Date: tomorrow | Status: Draft
  - WH/OUT/00003 | From: WH/Stock | To: Customer Z | Date: today-1  | Status: Done

Move History (auto-generated from Done receipt and delivery above):
  - Entry for WH/IN/00003  → Supplier → WH/Stock | Status: Ready
  - Entry for WH/OUT/00003 → WH/Stock → Customer Z | Status: Ready

Warehouse:
  - Name: Main Warehouse | Short Code: WH | Address: 123 Industrial Ave

Locations:
  - WH/Stock   | Short Code: STK | Warehouse: Main Warehouse
  - WH/Packing | Short Code: PCK | Warehouse: Main Warehouse

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DO NOT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Do not rebuild screens that already exist — only fix their routing,
  state connections, and flow logic
- Do not change the visual design or styling of existing screens
- Do not add new screens beyond those listed above
- Do not use any external API calls
- Do not use localStorage or sessionStorage