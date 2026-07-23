import { useMemo } from 'react'

interface AnalyticsSummary {
  totalSessions: number
  totalVolume: number
  averageRpe: number
  streak: number
}

export function useAnalyticsData(): AnalyticsSummary {
  return useMemo(() => {
    // Placeholder - aggregate from store/API
    return {
      totalSessions: 24,
      totalVolume: 48500,
      averageRpe: 7.2,
      streak: 5,
    }
  }, [])
}
