import { StockItem, MoveHistory, Anomaly } from "./store";

/**
 * Detects products with no movement in the last 60 days.
 */
export function detectDeadInventory(stock: StockItem[], moves: MoveHistory[]) {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  return stock.filter(item => {
    // Find last move for this product
    const productMoves = moves.filter(m => m.products.some(p => p.product === item.product));
    if (productMoves.length === 0) return true; // No history at all

    const lastMoveDate = new Date(productMoves[0].date);
    return lastMoveDate < sixtyDaysAgo;
  });
}

/**
 * Detects sudden spikes or drops in stock levels (Anomaly > 30%).
 */
export function detectAnomalies(moves: MoveHistory[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  
  // Group moves by product
  const productMovesMap: Record<string, MoveHistory[]> = {};
  moves.forEach(m => {
    m.products.forEach(p => {
      if (!productMovesMap[p.product]) productMovesMap[p.product] = [];
      productMovesMap[p.product].push(m);
    });
  });

  Object.entries(productMovesMap).forEach(([product, pMoves]) => {
    if (pMoves.length < 5) return; // Need more data for baseline

    // Calculate average movement
    const quantities = pMoves.map(m => m.products.find(p => p.product === product)?.quantity || 0);
    const avg = quantities.reduce((a, b) => a + b, 0) / quantities.length;

    // Check last move
    const lastQty = quantities[0];
    const deviation = Math.abs(lastQty - avg) / avg;

    if (deviation > 0.3) {
      anomalies.push({
        id: `anom-${Date.now()}-${product}`,
        product,
        type: 'Volume Spike',
        severity: deviation > 0.6 ? 'high' : 'medium',
        detectedValue: lastQty,
        expectedValue: Math.round(avg),
        date: pMoves[0].date
      });
    }
  });

  return anomalies;
}

/**
 * Suggests restock quantities based on demand and reorder levels.
 */
export function suggestRestocks(stock: StockItem[], moves: MoveHistory[]) {
  return stock
    .filter(item => item.onHand <= item.reserved + 10) // Simple low stock check
    .map(item => {
      // Predict demand (simplified)
      const pMoves = moves.filter(m => m.products.some(p => p.product === item.product));
      const avgWeekly = pMoves.length > 0 ? pMoves.reduce((acc, m) => acc + (m.products.find(p => p.product === item.product)?.quantity || 0), 0) / 4 : 20;

      return {
        product: item.product,
        currentStock: item.onHand,
        suggestedQty: Math.round(avgWeekly * 2), // 2 weeks of buffer
        priority: item.onHand === 0 ? 'critical' : 'medium'
      };
    });
}

/**
 * Generates demand prediction data for charts.
 */
export function predictDemandData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(day => ({
    day,
    actual: Math.floor(Math.random() * 50) + 20,
    predicted: Math.floor(Math.random() * 40) + 25
  }));
}
