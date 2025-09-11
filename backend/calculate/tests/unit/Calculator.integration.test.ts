import { expect, describe, it, beforeEach } from '@jest/globals'
import Calculator from '../../Calculator'
import { UserInput } from '../../types'

describe('Calculator', () => {
  let calculator: Calculator

  beforeEach(() => {
    calculator = new Calculator()
    // Set test environment to avoid AI calls
    process.env.NODE_ENV = 'test'
  })

  describe('calculateHandler', () => {
    it('should orchestrate the full calculation workflow', async () => {
      const userId = 'test-user-123'
      const userInput: UserInput = {
        housing: {
          monthlyElectricityBill: 100,
          usesNaturalGas: true,
          monthlyNaturalGasBill: 50,
        },
        transportation: {
          car: {
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
            commuteMilesOneWay: 10,
            commuteDaysPerWeek: 5,
            weeklyErrandsMilesRange: '25-50',
          },
        },
        food: {
          dietDescription: 'Meat a few times a week',
        },
        consumption: {
          shoppingFrequencyDescription: 'I buy new things every now and then.',
          recycledMaterials: ['Paper', 'Plastic'],
        },
      }

      const result = await calculator.calculateHandler(userId, userInput)

      // Verify the result structure
      expect(result).toBeDefined()
      expect(result.userId).toBe(userId)
      expect(result.calculationId).toContain(userId)
      expect(result.calculationId).toContain('-')
      expect(typeof result.carbonFootprint).toBe('number')
      expect(result.carbonFootprint).toBeGreaterThan(0)
      expect(result.aiAnalysis).toBeDefined()
      expect(result.averages).toBeDefined()
      expect(result.message).toContain('successfully')

      // Verify averages are set correctly
      expect(result.averages.global).toBe(4000)
      expect(result.averages.us).toBe(16000)

      // Verify AI analysis structure
      expect(result.aiAnalysis.summary).toBeDefined()
      expect(result.aiAnalysis.recommendations).toBeDefined()
      expect(result.aiAnalysis.disclaimer).toBeDefined()
    })

    it('should generate unique calculation IDs', async () => {
      const userId = 'test-user'
      const userInput: UserInput = {}

      const result1 = await calculator.calculateHandler(userId, userInput)
      // Small delay to ensure different timestamps
      await new Promise(resolve => globalThis.setTimeout(resolve, 10))
      const result2 = await calculator.calculateHandler(userId, userInput)

      expect(result1.calculationId).not.toBe(result2.calculationId)
      expect(result1.calculationId).toContain(userId)
      expect(result2.calculationId).toContain(userId)
    })

    it('should handle empty user input', async () => {
      const userId = 'test-user'
      const userInput: UserInput = {}

      const result = await calculator.calculateHandler(userId, userInput)

      expect(result).toBeDefined()
      expect(result.userId).toBe(userId)
      expect(typeof result.carbonFootprint).toBe('number')
      expect(result.carbonFootprint).toBeGreaterThan(0)
      expect(result.aiAnalysis).toBeDefined()
    })

    it('should include all required response fields', async () => {
      const userId = 'test-user'
      const userInput: UserInput = {
        housing: { monthlyElectricityBill: 75 },
      }

      const result = await calculator.calculateHandler(userId, userInput)

      // Check all required fields are present
      const requiredFields = ['userId', 'calculationId', 'carbonFootprint', 'aiAnalysis', 'averages', 'message']
      requiredFields.forEach(field => {
        expect(result).toHaveProperty(field)
      })

      // Check types
      expect(typeof result.userId).toBe('string')
      expect(typeof result.calculationId).toBe('string')
      expect(typeof result.carbonFootprint).toBe('number')
      expect(typeof result.aiAnalysis).toBe('object')
      expect(typeof result.averages).toBe('object')
      expect(typeof result.message).toBe('string')

      // Check averages structure
      expect(result.averages).toHaveProperty('global')
      expect(result.averages).toHaveProperty('us')
      expect(typeof result.averages.global).toBe('number')
      expect(typeof result.averages.us).toBe('number')
    })

    it('should handle various user input scenarios', async () => {
      const testCases = [
        {
          name: 'minimal input',
          input: { housing: { monthlyElectricityBill: 50 } },
        },
        {
          name: 'transportation only',
          input: {
            transportation: {
              car: { make: 'Honda', model: 'Civic', year: 2019 },
            },
          },
        },
        {
          name: 'food preferences only',
          input: { food: { dietDescription: 'Vegetarian (no meat)' } },
        },
      ]

      for (const testCase of testCases) {
        const result = await calculator.calculateHandler('test-user', testCase.input)
        expect(result).toBeDefined()
        expect(result.carbonFootprint).toBeGreaterThan(0)
        expect(result.aiAnalysis).toBeDefined()
      }
    })

    it('should handle realistic carbon footprint calculations', async () => {
      const userInput: UserInput = {
        housing: {
          monthlyElectricityBill: 150, // High electricity usage
          usesNaturalGas: true,
          monthlyNaturalGasBill: 80, // High gas usage
        },
        transportation: {
          car: {
            make: 'Ford',
            model: 'F-150', // Large truck
            year: 2018,
            commuteMilesOneWay: 25, // Long commute
            commuteDaysPerWeek: 5,
            weeklyErrandsMilesRange: '50-100',
          },
          flights: {
            under3Hours: 4, // Multiple short flights
            over6Hours: 2, // Long international flights
          },
        },
        food: {
          dietDescription: 'Meat in most meals', // High-emission diet
        },
        consumption: {
          shoppingFrequencyDescription: 'I buy new things frequently.',
          recycledMaterials: [], // No recycling
        },
      }

      const result = await calculator.calculateHandler('high-emission-user', userInput)

      // Should have significantly higher emissions than average
      expect(result.carbonFootprint).toBeGreaterThan(10000) // Above US average
      expect(result.aiAnalysis.summary.comparisonToAverages.us).toBeGreaterThan(0.6)
    })
  })
})
