import { StockItem, AutomationRule } from "./store";

/**
 * Evaluates automation rules against current stock state.
 * Returns a list of actions to be taken.
 */
export function evaluateRules(stock: StockItem[], rules: AutomationRule[]) {
  const actions: { ruleId: string; type: string; payload: any }[] = [];

  rules.forEach(rule => {
    if (!rule.isActive) return;

    // Worker identifies the condition
    const targetItem = stock.find(s => s.product === rule.product);
    if (!targetItem) return;

    // Logic based on rule type
    switch (rule.type) {
      case 'low_stock_restock':
        if (targetItem.onHand < rule.threshold) {
          actions.push({
            ruleId: rule.id,
            type: 'CREATE_RECEIPT',
            payload: { product: rule.product, quantity: rule.actionValue }
          });
        }
        break;
      
      case 'dead_inventory_alert':
        // This would use movement history, but for MVP we use a flag or threshold
        if (targetItem.onHand > 0 && targetItem.reserved === 0) {
             actions.push({
                ruleId: rule.id,
                type: 'NOTIFY_MANAGER',
                payload: { message: `Dead inventory detected for ${rule.product}` }
             });
        }
        break;

      default:
        console.warn(`Unknown rule type: ${rule.type}`);
    }
  });

  return actions;
}

/**
 * Suggests a new automation rule based on recent stock patterns.
 */
export function suggestAutomationRule(product: string, patterns: any) {
    return {
        id: `suggest-${Date.now()}`,
        name: `Auto-restock ${product}`,
        product,
        type: 'low_stock_restock',
        threshold: 50,
        actionValue: 200,
        isActive: false // Requires user confirmation
    };
}
