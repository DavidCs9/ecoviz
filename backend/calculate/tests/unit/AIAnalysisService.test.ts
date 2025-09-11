import { expect, describe, it, beforeEach, afterEach, jest } from '@jest/globals'
import { AIAnalysisService } from '../../services/AIAnalysisService'
import { CalculationData } from '../../types'

// Mock the OpenAI dependencies
jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({
    invoke: jest.fn(),
  })),
}))

jest.mock('@langchain/core/prompts', () => ({
  ChatPromptTemplate: {
    fromMessages: jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        invoke: jest.fn(),
      }),
    }),
  },
}))

describe('AIAnalysisService', () => {
  let aiAnalysisService: AIAnalysisService
  const originalNodeEnv = process.env.NODE_ENV
  const originalOpenAIKey = process.env.OPENAI_API_KEY

  beforeEach(() => {
    aiAnalysisService = new AIAnalysisService()
    // Reset environment variables
    process.env.NODE_ENV = 'test'
    delete process.env.OPENAI_API_KEY
  })

  afterEach(() => {
    // Restore original environment
    process.env.NODE_ENV = originalNodeEnv
    if (originalOpenAIKey) {
      process.env.OPENAI_API_KEY = originalOpenAIKey
    }
  })

  const mockData: CalculationData = {
    housing: {
      type: 'apartment',
      size: 1000,
      energy: { electricity: 1000, naturalGas: 100, heatingOil: 0 },
    },
    transportation: {
      car: { milesDriven: 12000, fuelEfficiency: 25 },
      publicTransit: { busMiles: 500, trainMiles: 200 },
      flights: { shortHaul: 2, longHaul: 1 },
    },
    food: {
      dietType: 'average',
      wasteLevel: 'average',
    },
    consumption: {
      shoppingHabits: 'frequent',
      recyclingHabits: 'some',
    },
  }

  const mockEmissions = {
    housing: 950,
    transportation: 5000,
    food: 912.5,
    consumption: 1500,
  }

  const totalEmissions = 8362.5

  describe('generateAnalysis', () => {
    it('should return fallback response when no API key is provided', async () => {
      const result = await aiAnalysisService.generateAnalysis(totalEmissions, mockData, mockEmissions)

      expect(result).toBeDefined()
      expect(result.summary).toBeDefined()
      expect(result.recommendations).toBeDefined()
      expect(result.disclaimer).toBeDefined()

      // Check summary structure
      expect(result.summary.totalEmissions).toBe(totalEmissions)
      expect(result.summary.comparisonToAverages).toHaveProperty('global')
      expect(result.summary.comparisonToAverages).toHaveProperty('us')
      expect(result.summary.topContributors).toHaveLength(3)

      // Check recommendations structure
      expect(result.recommendations).toHaveLength(2)
      expect(result.recommendations[0]).toHaveProperty('title')
      expect(result.recommendations[0]).toHaveProperty('description')
      expect(result.recommendations[0]).toHaveProperty('potentialImpact')
      expect(result.recommendations[0]).toHaveProperty('priority')
      expect(result.recommendations[0]).toHaveProperty('category')
    })

    it('should return fallback response in test environment', async () => {
      process.env.OPENAI_API_KEY = 'test-key'
      process.env.NODE_ENV = 'test'

      const result = await aiAnalysisService.generateAnalysis(totalEmissions, mockData, mockEmissions)

      expect(result).toBeDefined()
      expect(typeof result.summary.totalEmissions).toBe('number')
      expect(result.disclaimer).toContain('general advice')
    })

    it('should correctly identify top contributors', async () => {
      const result = await aiAnalysisService.generateAnalysis(totalEmissions, mockData, mockEmissions)

      const topContributors = result.summary.topContributors
      expect(topContributors).toHaveLength(3)

      // Transportation should be the highest contributor
      expect(topContributors[0].category).toBe('transportation')
      expect(topContributors[0].emissions).toBe(5000)
      expect(topContributors[0].percentage).toBeCloseTo(59.8, 1) // 5000/8362.5 * 100

      // Check that contributors are sorted by percentage descending
      expect(topContributors[0].percentage).toBeGreaterThan(topContributors[1].percentage)
      expect(topContributors[1].percentage).toBeGreaterThan(topContributors[2].percentage)
    })

    it('should calculate correct comparison to averages', async () => {
      const result = await aiAnalysisService.generateAnalysis(totalEmissions, mockData, mockEmissions)

      expect(result.summary.comparisonToAverages.global).toBeCloseTo(2.09, 2) // 8362.5 / 4000
      expect(result.summary.comparisonToAverages.us).toBeCloseTo(0.52, 2) // 8362.5 / 16000
    })

    it('should generate appropriate recommendations based on top contributors', async () => {
      const result = await aiAnalysisService.generateAnalysis(totalEmissions, mockData, mockEmissions)

      const recommendations = result.recommendations
      expect(recommendations).toHaveLength(2)

      // First recommendation should target the highest contributor (transportation)
      expect(recommendations[0].category).toBe('transportation')
      expect(recommendations[0].priority).toBe('high')
      expect(recommendations[0].potentialImpact.co2Reduction).toBe(1000) // 20% of 5000

      // Second recommendation should target the second highest contributor
      expect(recommendations[1].priority).toBe('medium')
      expect(recommendations[1].potentialImpact.unit).toBe('kg/year')
    })

    it('should handle edge case with zero emissions', async () => {
      const zeroEmissions = { housing: 0, transportation: 0, food: 0, consumption: 0 }

      const result = await aiAnalysisService.generateAnalysis(0, mockData, zeroEmissions)

      expect(result).toBeDefined()
      expect(result.summary.totalEmissions).toBe(0)
      expect(result.summary.topContributors).toHaveLength(3)
    })

    it('should handle small emissions correctly', async () => {
      const smallEmissions = { housing: 10, transportation: 5, food: 15, consumption: 8 }
      const total = 38

      const result = await aiAnalysisService.generateAnalysis(total, mockData, smallEmissions)

      expect(result.summary.totalEmissions).toBe(total)
      expect(result.summary.topContributors[0].category).toBe('food') // Highest contributor
      expect(result.recommendations[0].potentialImpact.co2Reduction).toBe(3) // 20% of 15
    })

    it('should include all required fields in response', async () => {
      const result = await aiAnalysisService.generateAnalysis(totalEmissions, mockData, mockEmissions)

      // Check all required fields exist
      expect(result.summary.totalEmissions).toBeDefined()
      expect(result.summary.comparisonToAverages.global).toBeDefined()
      expect(result.summary.comparisonToAverages.us).toBeDefined()
      expect(result.summary.topContributors).toBeDefined()

      result.recommendations.forEach(rec => {
        expect(rec.title).toBeDefined()
        expect(rec.description).toBeDefined()
        expect(rec.dataReference).toBeDefined()
        expect(rec.potentialImpact.co2Reduction).toBeDefined()
        expect(rec.potentialImpact.unit).toBe('kg/year')
        expect(rec.goal).toBeDefined()
        expect(['high', 'medium', 'low']).toContain(rec.priority)
        expect(['housing', 'transportation', 'food', 'consumption']).toContain(rec.category)
      })

      expect(result.disclaimer).toBeDefined()
      expect(result.disclaimer).toContain('general advice')
    })
  })
})
