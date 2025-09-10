import { describe, it, expect, beforeEach } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import { useDataPersistence, useDataPersistenceStore, PersistedDataSchema } from '../stores/dataStore'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useDataPersistence Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear the store state before each test
    act(() => {
      useDataPersistenceStore.getState().clearData()
    })
  })

  it('should validate and save valid data', () => {
    const { result } = renderHook(() => useDataPersistence())

    const validData = {
      carbonFootprint: 100.5,
      calculationData: {
        housing: {
          type: 'apartment',
          size: 100,
          energy: {
            electricity: 50,
            naturalGas: 30,
            heatingOil: 0,
          },
        },
        transportation: {
          car: {
            milesDriven: 10000,
            fuelEfficiency: 25,
          },
          publicTransit: {
            busMiles: 500,
            trainMiles: 200,
          },
          flights: {
            shortHaul: 2,
            longHaul: 1,
          },
        },
        food: {
          dietType: 'omnivore',
          wasteLevel: 'low',
        },
        consumption: {
          shoppingHabits: 'moderate',
          recyclingHabits: 'always',
        },
      },
      aiAnalysis: {
        summary: {
          totalEmissions: 100.5,
          comparisonToAverages: {
            global: 90,
            us: 110,
          },
          topContributors: [
            {
              category: 'transportation',
              percentage: 40,
              emissions: 40.2,
            },
          ],
        },
        recommendations: [
          {
            title: 'Use Public Transit',
            description: 'Consider using public transportation more often',
            dataReference: 'transportation.car.milesDriven',
            potentialImpact: {
              co2Reduction: 15.5,
              unit: 'kg/year' as const,
            },
            goal: 'Reduce car usage',
            priority: 'high' as const,
            category: 'transportation' as const,
          },
        ],
        disclaimer: 'These are estimates based on average data',
      },
      averages: {
        global: 90,
        us: 110,
      },
    }

    act(() => {
      const saveResult = result.current.validateAndSaveData(validData)
      expect(saveResult.success).toBe(true)
      expect(saveResult.error).toBeUndefined()
    })

    expect(result.current.persistedData).toEqual(validData)
  })

  it('should reject invalid data and return error', () => {
    const { result } = renderHook(() => useDataPersistence())

    const invalidData = {
      carbonFootprint: 'not a number', // This should be a number
      // Missing required fields
    }

    act(() => {
      const saveResult = result.current.validateAndSaveData(invalidData)
      expect(saveResult.success).toBe(false)
      expect(saveResult.error).toContain('Validation failed')
    })

    expect(result.current.persistedData).toBeNull()
  })

  it('should clear data when clearData is called', () => {
    const { result } = renderHook(() => useDataPersistence())

    // First save some data
    const validData = {
      carbonFootprint: 100.5,
      calculationData: {
        housing: {
          type: 'apartment',
          size: 100,
          energy: {
            electricity: 50,
            naturalGas: 30,
            heatingOil: 0,
          },
        },
        transportation: {
          car: {
            milesDriven: 10000,
            fuelEfficiency: 25,
          },
          publicTransit: {
            busMiles: 500,
            trainMiles: 200,
          },
          flights: {
            shortHaul: 2,
            longHaul: 1,
          },
        },
        food: {
          dietType: 'omnivore',
          wasteLevel: 'low',
        },
        consumption: {
          shoppingHabits: 'moderate',
          recyclingHabits: 'always',
        },
      },
      aiAnalysis: {
        summary: {
          totalEmissions: 100.5,
          comparisonToAverages: {
            global: 90,
            us: 110,
          },
          topContributors: [
            {
              category: 'transportation',
              percentage: 40,
              emissions: 40.2,
            },
          ],
        },
        recommendations: [],
        disclaimer: 'These are estimates based on average data',
      },
      averages: {
        global: 90,
        us: 110,
      },
    }

    act(() => {
      result.current.validateAndSaveData(validData)
    })

    expect(result.current.persistedData).not.toBeNull()

    // Then clear it
    act(() => {
      result.current.clearData()
    })

    expect(result.current.persistedData).toBeNull()
  })

  it('should validate schema properly', () => {
    const validData = {
      carbonFootprint: 100.5,
      calculationData: {
        housing: {
          type: 'apartment',
          size: 100,
          energy: {
            electricity: 50,
            naturalGas: 30,
            heatingOil: 0,
          },
        },
        transportation: {
          car: {
            milesDriven: 10000,
            fuelEfficiency: 25,
          },
          publicTransit: {
            busMiles: 500,
            trainMiles: 200,
          },
          flights: {
            shortHaul: 2,
            longHaul: 1,
          },
        },
        food: {
          dietType: 'omnivore',
          wasteLevel: 'low',
        },
        consumption: {
          shoppingHabits: 'moderate',
          recyclingHabits: 'always',
        },
      },
      aiAnalysis: {
        summary: {
          totalEmissions: 100.5,
          comparisonToAverages: {
            global: 90,
            us: 110,
          },
          topContributors: [],
        },
        recommendations: [],
        disclaimer: 'These are estimates based on average data',
      },
      averages: {
        global: 90,
        us: 110,
      },
    }

    // Test that our schema validates the structure correctly
    expect(() => PersistedDataSchema.parse(validData)).not.toThrow()

    // Test that invalid priority values are rejected
    const invalidPriorityData = {
      ...validData,
      aiAnalysis: {
        ...validData.aiAnalysis,
        recommendations: [
          {
            title: 'Test',
            description: 'Test description',
            dataReference: 'test',
            potentialImpact: {
              co2Reduction: 10,
              unit: 'kg/year' as const,
            },
            goal: 'Test goal',
            priority: 'invalid' as 'high' | 'medium' | 'low', // This should fail validation
            category: 'housing' as const,
          },
        ],
      },
    }

    expect(() => PersistedDataSchema.parse(invalidPriorityData)).toThrow()
  })
})
