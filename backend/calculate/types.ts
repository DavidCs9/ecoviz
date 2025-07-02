interface HousingData {
  type: string
  size: number
  energy: {
    electricity: number
    naturalGas: number
    heatingOil: number
  }
}

interface TransportationData {
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

interface FoodData {
  dietType: string
  wasteLevel: string
}

interface ConsumptionData {
  shoppingHabits: string
  recyclingHabits: string
}

interface CalculationData {
  housing: HousingData
  transportation: TransportationData
  food: FoodData
  consumption: ConsumptionData
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

export {
  HousingData,
  TransportationData,
  FoodData,
  ConsumptionData,
  CalculationData,
  AIRecommendation,
  AIAnalysisResponse,
}
