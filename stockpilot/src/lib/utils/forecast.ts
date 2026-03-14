type StockMove = any;

/**
 * Calculates a basic linear regression trend and 30-day simple moving average (SMA)
 * to forecast future demand based on historical stock moves.
 */
export function generateForecast(moves: StockMove[], daysToForecast = 30) {
  if (!moves || moves.length === 0) return null;

  // 1. Group descending quantities (demand/consumption) by day
  const dailyDemand: Record<string, number> = {};
  
  moves.forEach(move => {
    // Only consider outbound moves as demand
    if (move.move_type === 'out' || move.move_type === 'adjustment_out') {
      const date = new Date(move.created_at).toISOString().split('T')[0];
      dailyDemand[date] = (dailyDemand[date] || 0) + move.quantity;
    }
  });

  const dates = Object.keys(dailyDemand).sort();
  if (dates.length < 2) return null; // Not enough data for meaningful trend

  // Convert to array of [x, y] points where x is day index, y is quantity
  const dataPoints = dates.map((date, index) => [index, dailyDemand[date]]);

  // 2. Linear Regression (y = mx + b)
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  const n = dataPoints.length;

  dataPoints.forEach(([x, y]) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  // 3. Simple Moving Average (SMA) of last 7 points (or fewer if less data)
  const windowSize = Math.min(7, n);
  const recentPoints = dataPoints.slice(-windowSize);
  const currentSma = recentPoints.reduce((sum, [_, y]) => sum + y, 0) / windowSize;

  // 4. Forecast next points
  // We use a blend of the regression trend and the recent SMA to predict future values
  const lastIndex = dataPoints[n - 1][0];
  const forecastedTotalDemand = Array.from({ length: daysToForecast }).reduce((total: number, _, offset) => {
    const futureX = lastIndex + 1 + offset;
    const regressionPred = Math.max(0, m * futureX + b);
    
    // Weighted blend: 70% Regression Trend, 30% Recent Average (SMA)
    const blendedDailyPred = (regressionPred * 0.7) + (currentSma * 0.3);
    return total + blendedDailyPred;
  }, 0) as number;

  const currentTotalDemand = dataPoints.reduce((sum, [_, y]) => sum + y, 0);
  const avgHistoricalDaily = currentTotalDemand / n;
  const avgForecastedDaily = forecastedTotalDemand / daysToForecast;
  
  // Growth/Decline logic
  let trendPercentage = 0;
  if (avgHistoricalDaily > 0) {
     trendPercentage = Number((((avgForecastedDaily - avgHistoricalDaily) / avgHistoricalDaily) * 100).toFixed(1));
  }

  return {
    trendPct: trendPercentage,
    isGrowing: trendPercentage > 0,
    forecastedVolume: Math.round(forecastedTotalDemand),
    avgDaily: Math.round(avgForecastedDaily),
  };
}
