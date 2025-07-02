import { z } from 'zod';

export const HousingSchema = z.object({
  type: z.enum(['apartment', 'house', 'other']),
  size: z.number().min(1, "Household size must be at least 1"),
  energy: z.object({
    electricity: z.number().min(0, "Electricity usage cannot be negative"),
    naturalGas: z.number().min(0, "Natural gas usage cannot be negative"),
    heatingOil: z.number().min(0, "Heating oil usage cannot be negative"),
  }),
});

export const TransportationSchema = z.object({
  car: z.object({
    milesDriven: z.number().min(0, "Miles driven cannot be negative"),
    fuelEfficiency: z.number().min(0.1, "Fuel efficiency must be greater than 0"),
  }),
  publicTransit: z.object({
    busMiles: z.number().min(0, "Bus miles cannot be negative"),
    trainMiles: z.number().min(0, "Train miles cannot be negative"),
  }),
  flights: z.object({
    shortHaul: z.number().int().min(0, "Short haul flights cannot be negative"),
    longHaul: z.number().int().min(0, "Long haul flights cannot be negative"),
  }),
});

export const FoodSchema = z.object({
  dietType: z.enum(['meat-heavy', 'average', 'vegetarian', 'vegan']),
  wasteLevel: z.enum(['low', 'average', 'high']),
});

export const ConsumptionSchema = z.object({
  shoppingHabits: z.enum(['minimal', 'average', 'frequent']),
  recyclingHabits: z.enum(['none', 'some', 'most', 'all']),
});

export const CalculationDataSchema = z.object({
  housing: HousingSchema,
  transportation: TransportationSchema,
  food: FoodSchema,
  consumption: ConsumptionSchema,
});

export const CalculateRequestSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  data: CalculationDataSchema,
});

// Export TypeScript types for use in frontend and backend
export type HousingData = z.infer<typeof HousingSchema>;
export type TransportationData = z.infer<typeof TransportationSchema>;
export type FoodData = z.infer<typeof FoodSchema>;
export type ConsumptionData = z.infer<typeof ConsumptionSchema>;
export type CalculationData = z.infer<typeof CalculationDataSchema>;
export type CalculateRequest = z.infer<typeof CalculateRequestSchema>;