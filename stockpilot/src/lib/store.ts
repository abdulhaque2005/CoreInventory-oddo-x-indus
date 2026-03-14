import { create } from 'zustand';

// --- Types ---
export type UserRole = 'app' | 'sub' | null;

export interface AuthState {
  isLoggedIn: boolean;
  userType: UserRole;
  userName: string | null;
  login: (type: UserRole, name: string) => void;
  logout: () => void;
}

export interface StockItem {
  id: string;
  product: string;
  perUnitCost: number;
  onHand: number;
  reserved: number;
}

export type OperationStatus = 'Draft' | 'Ready' | 'Done' | 'Cancelled';

export interface OperationItem {
  id: string;
  product: string;
  quantity: number;
}

export interface Receipt {
  id: string;
  reference: string;
  from: string;
  to: string;
  scheduledDate: string;
  status: OperationStatus;
  products: OperationItem[];
  responsible: string;
}

export interface Delivery {
  id: string;
  reference: string;
  from: string;
  to: string;
  scheduledDate: string;
  status: OperationStatus;
  products: OperationItem[];
  responsible: string;
}

export interface MoveHistory {
  id: string;
  type: 'Receipt' | 'Delivery' | 'Internal';
  reference: string;
  from: string;
  to: string;
  price: number;
  quantity: number;
  status: OperationStatus;
  date: string;
  products: OperationItem[];
}

export interface Warehouse {
  id: string;
  name: string;
  shortCode: string;
  address: string;
}

export interface Location {
  id: string;
  name: string;
  shortCode: string;
  warehouseId: string;
}

export interface Anomaly {
  id: string;
  product: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  detectedValue: number;
  expectedValue: number;
  date: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  product: string;
  type: 'low_stock_restock' | 'dead_inventory_alert';
  threshold: number;
  actionValue: number;
  isActive: boolean;
}

export interface AppState {
  // Auth
  auth: AuthState;
  
  // Stock
  stock: StockItem[];
  updateStockOnHand: (id: string, newQty: number) => void;
  processStockChange: (products: OperationItem[], type: 'add' | 'subtract') => void;
  lastStockUpdate: Date;

  // AI & Intelligence
  aiMessages: AiChatMessage[];
  addAiMessage: (message: AiChatMessage) => void;
  anomalies: Anomaly[];
  addAnomaly: (anomaly: Anomaly) => void;

  // Automation
  automationRules: AutomationRule[];
  toggleRule: (id: string) => void;
  addRule: (rule: AutomationRule) => void;

  // Receipts
  receipts: Receipt[];
  updateReceiptStatus: (id: string, newStatus: OperationStatus) => void;
  
  // Deliveries
  deliveries: Delivery[];
  updateDeliveryStatus: (id: string, newStatus: OperationStatus) => void;
  
  // Move History
  moveHistory: MoveHistory[];
  addMoveHistory: (move: MoveHistory) => void;
  
  // Settings
  warehouses: Warehouse[];
  updateWarehouse: (id: string, updates: Partial<Warehouse>) => void;
  
  locations: Location[];
  addLocation: (location: Location) => void;
}

// --- Initial Mock Data ---
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const initialStock: StockItem[] = [
  // --- Standard items ---
  { id: 'p1', product: 'Bolt (M8x20)', perUnitCost: 0.15, onHand: 5000, reserved: 200 },
  { id: 'p2', product: 'Yoke', perUnitCost: 800, onHand: 30, reserved: 10 },
  { id: 'p3', product: 'Steel Plate (10mm)', perUnitCost: 45.5, onHand: 150, reserved: 50 },
  { id: 'p4', product: 'Lithium Battery Pack', perUnitCost: 120, onHand: 45, reserved: 5 },
  { id: 'p5', product: 'Sensor Module V2', perUnitCost: 35, onHand: 210, reserved: 0 },
  // --- Overstock (high qty) ---
  { id: 'p6', product: 'Copper Wire (100m spool)', perUnitCost: 22.0, onHand: 15000, reserved: 50 },
  { id: 'p7', product: 'Rubber Gasket (Ø50mm)', perUnitCost: 0.80, onHand: 25000, reserved: 100 },
  // --- Critical Low / Stockout ---
  { id: 'p8', product: 'Hydraulic Cylinder', perUnitCost: 1450, onHand: 2, reserved: 2 },
  { id: 'p9', product: 'Titanium Rod (Grade 5)', perUnitCost: 320, onHand: 0, reserved: 0 },
  { id: 'p10', product: 'Carbon Fiber Sheet (1m²)', perUnitCost: 250, onHand: 0, reserved: 3 },
  // --- Very High Value ---
  { id: 'p11', product: 'CNC Spindle Motor', perUnitCost: 4500, onHand: 8, reserved: 1 },
  { id: 'p12', product: 'Industrial Robot Arm (6-Axis)', perUnitCost: 28000, onHand: 3, reserved: 0 },
  // --- Dead Inventory (no movement expected) ---
  { id: 'p13', product: 'Legacy PLC Controller (v1)', perUnitCost: 180, onHand: 75, reserved: 0 },
  { id: 'p14', product: 'Obsolete Relay Switch (K-Type)', perUnitCost: 5.20, onHand: 4200, reserved: 0 },
  // --- Consumables ---
  { id: 'p15', product: 'Welding Electrode (E6013)', perUnitCost: 0.45, onHand: 8000, reserved: 500 },
  { id: 'p16', product: 'Cutting Disc (125mm)', perUnitCost: 1.80, onHand: 3500, reserved: 120 },
  // --- Anomaly-prone (price spike / qty mismatch) ---
  { id: 'p17', product: 'Rare Earth Magnet (N52)', perUnitCost: 95.0, onHand: 120, reserved: 110 },
  { id: 'p18', product: 'Gold-Plated Connector (SMA)', perUnitCost: 12.50, onHand: 950, reserved: 900 },
  // --- Electronics ---
  { id: 'p19', product: 'OLED Display Module (128x64)', perUnitCost: 8.75, onHand: 600, reserved: 40 },
  { id: 'p20', product: 'ESP32 Microcontroller', perUnitCost: 4.20, onHand: 1200, reserved: 80 },
  // --- Packaging / Misc ---
  { id: 'p21', product: 'Shrink Wrap Roll (500mm)', perUnitCost: 15.0, onHand: 240, reserved: 10 },
  { id: 'p22', product: 'Corrugated Box (60x40x30)', perUnitCost: 2.50, onHand: 5000, reserved: 200 },
  // --- Safety / PPE ---
  { id: 'p23', product: 'Safety Goggles (EN166)', perUnitCost: 6.50, onHand: 300, reserved: 0 },
  { id: 'p24', product: 'Heat-Resistant Gloves (Pair)', perUnitCost: 18.0, onHand: 150, reserved: 25 },
];

const initialReceipts: Receipt[] = [
  { id: 'r1', reference: 'WH/IN/00001', from: 'Fastenal Corp.', to: 'WH/Stock', scheduledDate: today, status: 'Ready', responsible: 'Ahmed Khan', products: [{id: 'pr1', product: 'Bolt (M8x20)', quantity: 5000}, {id: 'pr1b', product: 'Rubber Gasket (Ø50mm)', quantity: 2000}] },
  { id: 'r2', reference: 'WH/IN/00002', from: 'RS Components Ltd.', to: 'WH/Stock', scheduledDate: today, status: 'Draft', responsible: 'Sara Ali', products: [{id: 'pr2', product: 'ESP32 Microcontroller', quantity: 500}, {id: 'pr2b', product: 'OLED Display Module (128x64)', quantity: 300}, {id: 'pr2c', product: 'Sensor Module V2', quantity: 200}] },
  { id: 'r3', reference: 'WH/IN/00003', from: 'Würth Industries', to: 'WH/Stock', scheduledDate: yesterday, status: 'Done', responsible: 'Ahmed Khan', products: [{id: 'pr3', product: 'Welding Electrode (E6013)', quantity: 4000}, {id: 'pr3b', product: 'Cutting Disc (125mm)', quantity: 1500}] },
  { id: 'r4', reference: 'WH/IN/00004', from: 'Parker Hannifin', to: 'WH/Stock', scheduledDate: tomorrow, status: 'Draft', responsible: 'Usman Raza', products: [{id: 'pr4', product: 'Hydraulic Cylinder', quantity: 10}] },
  { id: 'r5', reference: 'WH/IN/00005', from: 'Mitsubishi Electric', to: 'WH/Stock', scheduledDate: yesterday, status: 'Done', responsible: 'Sara Ali', products: [{id: 'pr5', product: 'CNC Spindle Motor', quantity: 4}, {id: 'pr5b', product: 'Lithium Battery Pack', quantity: 50}] },
  { id: 'r6', reference: 'WH/IN/00006', from: 'Siemens AG', to: 'WH/Stock', scheduledDate: today, status: 'Ready', responsible: 'Usman Raza', products: [{id: 'pr6', product: 'Legacy PLC Controller (v1)', quantity: 20}] },
  { id: 'r7', reference: 'WH/IN/00007', from: 'McMaster-Carr', to: 'WH/Stock', scheduledDate: tomorrow, status: 'Draft', responsible: 'Ahmed Khan', products: [{id: 'pr7', product: 'Steel Plate (10mm)', quantity: 100}, {id: 'pr7b', product: 'Copper Wire (100m spool)', quantity: 500}, {id: 'pr7c', product: 'Safety Goggles (EN166)', quantity: 200}] },
];

const initialDeliveries: Delivery[] = [
  { id: 'd1', reference: 'WH/OUT/00001', from: 'WH/Stock', to: 'Al-Futtaim Engineering', scheduledDate: today, status: 'Ready', responsible: 'Ahmed Khan', products: [{id: 'pd1', product: 'Steel Plate (10mm)', quantity: 25}, {id: 'pd1b', product: 'Bolt (M8x20)', quantity: 2000}] },
  { id: 'd2', reference: 'WH/OUT/00002', from: 'WH/Stock', to: 'Descon Engineering', scheduledDate: today, status: 'Ready', responsible: 'Sara Ali', products: [{id: 'pd2', product: 'Welding Electrode (E6013)', quantity: 3000}, {id: 'pd2b', product: 'Cutting Disc (125mm)', quantity: 500}] },
  { id: 'd3', reference: 'WH/OUT/00003', from: 'WH/Stock', to: 'Emirates Steel Industries', scheduledDate: yesterday, status: 'Done', responsible: 'Usman Raza', products: [{id: 'pd3', product: 'Yoke', quantity: 5}, {id: 'pd3b', product: 'Hydraulic Cylinder', quantity: 2}] },
  { id: 'd4', reference: 'WH/OUT/00004', from: 'WH/Stock', to: 'Habib Rafiq Pvt Ltd', scheduledDate: tomorrow, status: 'Draft', responsible: 'Ahmed Khan', products: [{id: 'pd4', product: 'CNC Spindle Motor', quantity: 2}, {id: 'pd4b', product: 'Industrial Robot Arm (6-Axis)', quantity: 1}] },
  { id: 'd5', reference: 'WH/OUT/00005', from: 'WH/Stock', to: 'NESPAK Contractors', scheduledDate: yesterday, status: 'Done', responsible: 'Sara Ali', products: [{id: 'pd5', product: 'Corrugated Box (60x40x30)', quantity: 1000}, {id: 'pd5b', product: 'Shrink Wrap Roll (500mm)', quantity: 50}] },
  { id: 'd6', reference: 'WH/OUT/00006', from: 'WH/Stock', to: 'Millat Tractors Ltd', scheduledDate: today, status: 'Ready', responsible: 'Usman Raza', products: [{id: 'pd6', product: 'Rare Earth Magnet (N52)', quantity: 30}, {id: 'pd6b', product: 'Gold-Plated Connector (SMA)', quantity: 100}] },
];

const initialMoveHistory: MoveHistory[] = [
  { id: 'm1', type: 'Receipt', reference: 'WH/IN/00003', from: 'Würth Industries', to: 'WH/Stock', price: 2475, quantity: 5500, status: 'Done', date: yesterday, products: [{id: 'pm1', product: 'Welding Electrode (E6013)', quantity: 4000}, {id: 'pm1b', product: 'Cutting Disc (125mm)', quantity: 1500}] },
  { id: 'm2', type: 'Delivery', reference: 'WH/OUT/00003', from: 'WH/Stock', to: 'Emirates Steel Industries', price: 6900, quantity: 7, status: 'Done', date: yesterday, products: [{id: 'pm2', product: 'Yoke', quantity: 5}, {id: 'pm2b', product: 'Hydraulic Cylinder', quantity: 2}] },
  { id: 'm3', type: 'Receipt', reference: 'WH/IN/00005', from: 'Mitsubishi Electric', to: 'WH/Stock', price: 24000, quantity: 54, status: 'Done', date: yesterday, products: [{id: 'pm3', product: 'CNC Spindle Motor', quantity: 4}, {id: 'pm3b', product: 'Lithium Battery Pack', quantity: 50}] },
  { id: 'm4', type: 'Delivery', reference: 'WH/OUT/00005', from: 'WH/Stock', to: 'NESPAK Contractors', price: 3250, quantity: 1050, status: 'Done', date: yesterday, products: [{id: 'pm4', product: 'Corrugated Box (60x40x30)', quantity: 1000}, {id: 'pm4b', product: 'Shrink Wrap Roll (500mm)', quantity: 50}] },
  { id: 'm5', type: 'Internal', reference: 'WH/INT/00001', from: 'WH/Stock', to: 'WH/Packing', price: 0, quantity: 200, status: 'Done', date: yesterday, products: [{id: 'pm5', product: 'Corrugated Box (60x40x30)', quantity: 200}] },
  { id: 'm6', type: 'Receipt', reference: 'WH/IN/00008', from: 'Fastenal Corp.', to: 'WH/Stock', price: 750, quantity: 5000, status: 'Done', date: today, products: [{id: 'pm6', product: 'Bolt (M8x20)', quantity: 5000}] },
  { id: 'm7', type: 'Delivery', reference: 'WH/OUT/00007', from: 'WH/Stock', to: 'Al-Futtaim Engineering', price: 11375, quantity: 500, status: 'Done', date: today, products: [{id: 'pm7', product: 'Steel Plate (10mm)', quantity: 50}, {id: 'pm7b', product: 'Bolt (M8x20)', quantity: 450}] },
  { id: 'm8', type: 'Internal', reference: 'WH/INT/00002', from: 'WH/Packing', to: 'WH/Stock', price: 0, quantity: 100, status: 'Done', date: today, products: [{id: 'pm8', product: 'ESP32 Microcontroller', quantity: 100}] },
];

const initialAutomationRules: AutomationRule[] = [
  { id: 'ar1', name: 'Auto-Restock Bolts', product: 'Bolt (M8x20)', type: 'low_stock_restock', threshold: 1000, actionValue: 2000, isActive: true },
  { id: 'ar2', name: 'Dead Inventory Check', product: 'Yoke', type: 'dead_inventory_alert', threshold: 0, actionValue: 0, isActive: false },
];

// --- Zustand Store ---
export const useAppStore = create<AppState>()((set, get) => ({
  // Auth
  auth: {
    isLoggedIn: false,
    userType: null,
    userName: null,
    login: (type, name) => set((state) => ({ auth: { ...state.auth, isLoggedIn: true, userType: type, userName: name } })),
    logout: () => set((state) => ({ auth: { ...state.auth, isLoggedIn: false, userType: null, userName: null } })),
  },

  // Stock
  stock: initialStock,
  lastStockUpdate: new Date(),
  updateStockOnHand: (id, newQty) => set((state) => ({
    stock: state.stock.map(item => item.id === id ? { ...item, onHand: newQty } : item),
    lastStockUpdate: new Date()
  })),
  processStockChange: (products, type) => set((state) => {
    let updatedStock = [...state.stock];
    products.forEach(p => {
      const stockItemIndex = updatedStock.findIndex(s => s.product === p.product);
      if (stockItemIndex !== -1) {
        if (type === 'add') {
          updatedStock[stockItemIndex].onHand += p.quantity;
        } else if (type === 'subtract') {
          updatedStock[stockItemIndex].onHand -= p.quantity;
        }
      }
    });
    return { stock: updatedStock, lastStockUpdate: new Date() };
  }),

  // AI & Intelligence
  aiMessages: [],
  addAiMessage: (message) => set((state) => ({ aiMessages: [...state.aiMessages, message] })),
  anomalies: [
    { id: 'a1', product: 'Bolt (M8x20)', type: 'Quantity Threshold', severity: 'medium', detectedValue: 5000, expectedValue: 4500, date: yesterday },
    { id: 'a2', product: 'Titanium Rod (Grade 5)', type: 'Stockout Alert', severity: 'high', detectedValue: 0, expectedValue: 50, date: today },
    { id: 'a3', product: 'Carbon Fiber Sheet (1m²)', type: 'Negative Available', severity: 'high', detectedValue: -3, expectedValue: 10, date: today },
    { id: 'a4', product: 'Rare Earth Magnet (N52)', type: 'Over-Reserved', severity: 'medium', detectedValue: 110, expectedValue: 20, date: yesterday },
    { id: 'a5', product: 'Obsolete Relay Switch (K-Type)', type: 'Dead Inventory', severity: 'low', detectedValue: 4200, expectedValue: 0, date: yesterday },
  ],
  addAnomaly: (anomaly) => set((state) => ({ anomalies: [...state.anomalies, anomaly] })),

  // Automation
  automationRules: initialAutomationRules,
  toggleRule: (id) => set((state) => ({
    automationRules: state.automationRules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
  })),
  addRule: (rule) => set((state) => ({
    automationRules: [...state.automationRules, rule]
  })),

  // Receipts
  receipts: initialReceipts,
  updateReceiptStatus: (id, newStatus) => set((state) => ({
    receipts: state.receipts.map(r => r.id === id ? { ...r, status: newStatus } : r)
  })),

  // Deliveries
  deliveries: initialDeliveries,
  updateDeliveryStatus: (id, newStatus) => set((state) => ({
    deliveries: state.deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d)
  })),

  // Move History
  moveHistory: initialMoveHistory,
  addMoveHistory: (move) => set((state) => ({
    moveHistory: [move, ...state.moveHistory]
  })),

  // Settings
  warehouses: [
    { id: 'w1', name: 'Main Warehouse', shortCode: 'WH', address: '123 Industrial Ave' }
  ],
  updateWarehouse: (id, updates) => set((state) => ({
    warehouses: state.warehouses.map(w => w.id === id ? { ...w, ...updates } : w)
  })),

  locations: [
    { id: 'l1', name: 'WH/Stock', shortCode: 'STK', warehouseId: 'w1' },
    { id: 'l2', name: 'WH/Packing', shortCode: 'PCK', warehouseId: 'w1' },
  ],
  addLocation: (location) => set((state) => ({
    locations: [...state.locations, location]
  }))
}));
