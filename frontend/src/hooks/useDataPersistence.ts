import { useState, useEffect } from 'react'

interface CalculationData {
  housing: {
    type: string
    size: number
    energy: {
      electricity: number
      naturalGas: number
      heatingOil: number
    }
  }
  transportation: {
    car: {
      milesDriven: number
      fuelEfficiency: number
    }
    publicTransit: {
      busMiles: number
      trainMiles: number
    }
    flights: {
      shortHaul: number
      longHaul: number
    }
  }
  food: {
    dietType: string
    wasteLevel: string
  }
  consumption: {
    shoppingHabits: string
    recyclingHabits: string
  }
}

interface AIRecommendation {
  title: string
  description: string
  dataReference: string
  potentialImpact: {
    co2Reduction: number
    unit: 'kg/year'
  }
  goal: string
  priority: 'high' | 'medium' | 'low'
  category: 'housing' | 'transportation' | 'food' | 'consumption'
}

interface AIAnalysisResponse {
  summary: {
    totalEmissions: number
    comparisonToAverages: {
      global: number
      us: number
    }
    topContributors: Array<{
      category: string
      percentage: number
      emissions: number
    }>
  }
  recommendations: AIRecommendation[]
  disclaimer: string
}

export interface PersistedData {
  carbonFootprint: number
  calculationData: CalculationData
  aiAnalysis: AIAnalysisResponse
  averages: {
    global: number
    us: number
  }
}

export const useDataPersistence = () => {
  const [persistedData, setPersistedData] = useState<PersistedData | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem('resultsData')
    if (storedData) {
      setPersistedData(JSON.parse(storedData))
    }
  }, [])

  const saveData = (data: PersistedData) => {
    localStorage.setItem('resultsData', JSON.stringify(data))
    setPersistedData(data)
  }

  return { persistedData, saveData }
}
