import { expect, describe, it, beforeEach } from '@jest/globals'
import { EmissionCalculator } from '../../services/EmissionCalculator'
import { CalculationData } from '../../types'

describe('EmissionCalculator', () => {
  let emissionCalculator: EmissionCalculator

  beforeEach(() => {
    emissionCalculator = new EmissionCalculator()
  })

  const mockData: CalculationData = {
    housing: {
      type: 'apartment',
      size: 1000,
      energy: {
        electricity: 1000, // kWh per year
        naturalGas: 100, // therms per year
        heatingOil: 50, // gallons per year
      },
    },
    transportation: {
      car: {
        milesDriven: 12000, // miles per year
        fuelEfficiency: 25, // MPG
      },
      publicTransit: {
        busMiles: 1000, // miles per year
        trainMiles: 500, // miles per year
      },
      flights: {
        shortHaul: 2, // flights per year
        longHaul: 1, // flights per year
      },
    },
    food: {
      dietType: 'average',
      wasteLevel: 'average',
    },
    consumption: {
      shoppingHabits: 'average',
      recyclingHabits: 'some',
    },
  }

  describe('calculateTotal', () => {
    it('should calculate total emissions correctly', () => {
      const total = emissionCalculator.calculateTotal(mockData)

      expect(total).toBeGreaterThan(0)
      expect(typeof total).toBe('number')
      expect(total).toBeCloseTo(14317, 0) // Approximate expected total
    })

    it('should return zero for empty data', () => {
      const emptyData: CalculationData = {
        housing: { type: 'apartment', size: 0, energy: { electricity: 0, naturalGas: 0, heatingOil: 0 } },
        transportation: {
          car: { milesDriven: 0, fuelEfficiency: 25 },
          publicTransit: { busMiles: 0, trainMiles: 0 },
          flights: { shortHaul: 0, longHaul: 0 },
        },
        food: { dietType: 'average', wasteLevel: 'average' },
        consumption: { shoppingHabits: 'minimal', recyclingHabits: 'all' },
      }

      const total = emissionCalculator.calculateTotal(emptyData)
      expect(total).toBeGreaterThan(0) // Should still have some emissions from food and consumption base levels
    })
  })

  describe('calculateByCategory', () => {
    it('should return emissions breakdown by category', () => {
      const breakdown = emissionCalculator.calculateByCategory(mockData)

      expect(breakdown).toHaveProperty('housing')
      expect(breakdown).toHaveProperty('transportation')
      expect(breakdown).toHaveProperty('food')
      expect(breakdown).toHaveProperty('consumption')

      expect(breakdown.housing).toBeGreaterThan(0)
      expect(breakdown.transportation).toBeGreaterThan(0)
      expect(breakdown.food).toBeGreaterThan(0)
      expect(breakdown.consumption).toBeGreaterThan(0)

      // Verify that sum equals total
      const total = emissionCalculator.calculateTotal(mockData)
      const sum = breakdown.housing + breakdown.transportation + breakdown.food + breakdown.consumption
      expect(sum).toBeCloseTo(total, 2)
    })
  })

  describe('calculateHousingEmissions', () => {
    it('should calculate housing emissions correctly', () => {
      const emissions = emissionCalculator.calculateHousingEmissions(mockData.housing)

      // Expected: (1000 * 0.42) + (100 * 5.3) + (50 * 10.15) = 420 + 530 + 507.5 = 1457.5
      expect(emissions).toBeCloseTo(1457.5, 1)
    })

    it('should handle zero energy consumption', () => {
      const zeroHousing = {
        type: 'apartment',
        size: 1000,
        energy: { electricity: 0, naturalGas: 0, heatingOil: 0 },
      }

      const emissions = emissionCalculator.calculateHousingEmissions(zeroHousing)
      expect(emissions).toBe(0)
    })
  })

  describe('calculateTransportationEmissions', () => {
    it('should calculate transportation emissions correctly', () => {
      const emissions = emissionCalculator.calculateTransportationEmissions(mockData.transportation)

      // Expected: (12000/25 * 8.89) + (1000 * 0.059) + (500 * 0.041) + (2 * 1100) + (1 * 4400)
      // = (480 * 8.89) + 59 + 20.5 + 2200 + 4400 = 4267.2 + 59 + 20.5 + 2200 + 4400 = 10946.7
      expect(emissions).toBeCloseTo(10946.7, 1)
    })

    it('should handle zero transportation', () => {
      const zeroTransport = {
        car: { milesDriven: 0, fuelEfficiency: 25 },
        publicTransit: { busMiles: 0, trainMiles: 0 },
        flights: { shortHaul: 0, longHaul: 0 },
      }

      const emissions = emissionCalculator.calculateTransportationEmissions(zeroTransport)
      expect(emissions).toBe(0)
    })
  })

  describe('calculateFoodEmissions', () => {
    it('should calculate food emissions correctly for different diet types', () => {
      const testCases = [
        { dietType: 'meat-heavy', expected: 365 * 3.3 * 1.0 },
        { dietType: 'average', expected: 365 * 2.5 * 1.0 },
        { dietType: 'vegetarian', expected: 365 * 1.7 * 1.0 },
        { dietType: 'vegan', expected: 365 * 1.5 * 1.0 },
      ]

      testCases.forEach(({ dietType, expected }) => {
        const foodData = { dietType, wasteLevel: 'average' }
        const emissions = emissionCalculator.calculateFoodEmissions(foodData)
        expect(emissions).toBeCloseTo(expected, 1)
      })
    })

    it('should apply waste level multipliers correctly', () => {
      const testCases = [
        { wasteLevel: 'low', multiplier: 0.9 },
        { wasteLevel: 'average', multiplier: 1.0 },
        { wasteLevel: 'high', multiplier: 1.1 },
      ]

      testCases.forEach(({ wasteLevel, multiplier }) => {
        const foodData = { dietType: 'average', wasteLevel }
        const emissions = emissionCalculator.calculateFoodEmissions(foodData)
        const expected = 365 * 2.5 * multiplier
        expect(emissions).toBeCloseTo(expected, 1)
      })
    })
  })

  describe('calculateConsumptionEmissions', () => {
    it('should calculate consumption emissions with shopping and recycling factors', () => {
      const testCases = [
        { shopping: 'minimal', recycling: 'all', expectedMultiplier: 0.5 * 0.6 },
        { shopping: 'average', recycling: 'some', expectedMultiplier: 1.0 * 1.0 },
        { shopping: 'frequent', recycling: 'none', expectedMultiplier: 1.5 * 1.2 },
      ]

      testCases.forEach(({ shopping, recycling, expectedMultiplier }) => {
        const consumptionData = { shoppingHabits: shopping, recyclingHabits: recycling }
        const emissions = emissionCalculator.calculateConsumptionEmissions(consumptionData)
        const expected = 1000 * expectedMultiplier // Base consumption * factors
        expect(emissions).toBeCloseTo(expected, 1)
      })
    })

    it('should handle unknown habits with defaults', () => {
      const consumptionData = { shoppingHabits: 'unknown', recyclingHabits: 'unknown' }
      const emissions = emissionCalculator.calculateConsumptionEmissions(consumptionData)

      // Should default to average shopping (1.0) and some recycling (1.0)
      expect(emissions).toBeCloseTo(1000, 1)
    })
  })
})
