import { expect, describe, it, beforeEach } from '@jest/globals'
import { InputTransformer } from '../../services/InputTransformer'
import { UserInput } from '../../types'

describe('InputTransformer - Simple', () => {
  let inputTransformer: InputTransformer

  beforeEach(() => {
    inputTransformer = new InputTransformer()
  })

  describe('transform', () => {
    it('should handle empty input gracefully', async () => {
      const userInput: UserInput = {}

      const result = await inputTransformer.transform(userInput)

      expect(result).toBeDefined()
      expect(result.housing).toBeDefined()
      expect(result.transportation).toBeDefined()
      expect(result.food).toBeDefined()
      expect(result.consumption).toBeDefined()

      // Verify basic structure without asserting specific values
      expect(typeof result.housing.energy.electricity).toBe('number')
      expect(typeof result.housing.energy.naturalGas).toBe('number')
      expect(typeof result.housing.energy.heatingOil).toBe('number')
      expect(typeof result.transportation.car.milesDriven).toBe('number')
      expect(typeof result.food.dietType).toBe('string')
      expect(typeof result.consumption.shoppingHabits).toBe('string')
      expect(typeof result.consumption.recyclingHabits).toBe('string')
    })

    it('should transform basic user input', async () => {
      const userInput: UserInput = {
        housing: {
          monthlyElectricityBill: 100,
        },
        transportation: {
          car: {
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
          },
        },
        food: {
          dietDescription: 'Vegetarian (no meat)',
        },
        consumption: {
          recycledMaterials: ['Paper'],
        },
      }

      const result = await inputTransformer.transform(userInput)

      expect(result).toBeDefined()
      expect(result.housing.energy.electricity).toBeGreaterThan(0)
      expect(result.food.dietType).toBe('vegetarian')
      expect(result.consumption.recyclingHabits).toBe('some')
    })
  })
})
