import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Zod schemas for validation
const CalculationDataSchema = z.object({
  housing: z.object({
    type: z.string(),
    size: z.number(),
    energy: z.object({
      electricity: z.number(),
      naturalGas: z.number(),
      heatingOil: z.number(),
    }),
  }),
  transportation: z.object({
    car: z.object({
      milesDriven: z.number(),
      fuelEfficiency: z.number(),
    }),
    publicTransit: z.object({
      busMiles: z.number(),
      trainMiles: z.number(),
    }),
    flights: z.object({
      shortHaul: z.number(),
      longHaul: z.number(),
    }),
  }),
  food: z.object({
    dietType: z.string(),
    wasteLevel: z.string(),
  }),
  consumption: z.object({
    shoppingHabits: z.string(),
    recyclingHabits: z.string(),
  }),
});

const AIRecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  dataReference: z.string(),
  potentialImpact: z.object({
    co2Reduction: z.number(),
    unit: z.literal("kg/year"),
  }),
  goal: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  category: z.enum(["housing", "transportation", "food", "consumption"]),
});

const AIAnalysisResponseSchema = z.object({
  summary: z.object({
    totalEmissions: z.number(),
    comparisonToAverages: z.object({
      global: z.number(),
      us: z.number(),
    }),
    topContributors: z.array(
      z.object({
        category: z.string(),
        percentage: z.number(),
        emissions: z.number(),
      })
    ),
  }),
  recommendations: z.array(AIRecommendationSchema),
  disclaimer: z.string(),
});

export const PersistedDataSchema = z.object({
  carbonFootprint: z.number(),
  calculationData: CalculationDataSchema,
  aiAnalysis: AIAnalysisResponseSchema,
  averages: z.object({
    global: z.number(),
    us: z.number(),
  }),
});

// Infer TypeScript types from Zod schemas
export type CalculationData = z.infer<typeof CalculationDataSchema>;
export type AIRecommendation = z.infer<typeof AIRecommendationSchema>;
export type AIAnalysisResponse = z.infer<typeof AIAnalysisResponseSchema>;
export type PersistedData = z.infer<typeof PersistedDataSchema>;

// Zustand store with persistence
interface DataPersistenceStore {
  persistedData: PersistedData | null;
  saveData: (data: PersistedData) => void;
  clearData: () => void;
  validateAndSaveData: (data: unknown) => { success: boolean; error?: string };
}

export const useDataPersistenceStore = create<DataPersistenceStore>()(
  persist(
    (set) => ({
      persistedData: null,

      saveData: (data: PersistedData) => {
        try {
          // Validate data before saving
          const validatedData = PersistedDataSchema.parse(data);
          set({ persistedData: validatedData });
        } catch (error) {
          console.error("Failed to save data - validation error:", error);
          throw new Error("Invalid data format");
        }
      },

      clearData: () => {
        set({ persistedData: null });
      },

      validateAndSaveData: (data: unknown) => {
        try {
          const validatedData = PersistedDataSchema.parse(data);
          set({ persistedData: validatedData });
          return { success: true };
        } catch (error) {
          const errorMessage =
            error instanceof z.ZodError
              ? `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`
              : "Unknown validation error";
          return { success: false, error: errorMessage };
        }
      },
    }),
    {
      name: "ecoviz-results-data",
      version: 1,
      partialize: (state) => ({ persistedData: state.persistedData }),
    }
  )
);

// Hook for backward compatibility and ease of use
export const useDataPersistence = () => {
  const { persistedData, saveData, clearData, validateAndSaveData } = useDataPersistenceStore();

  return {
    persistedData,
    saveData,
    clearData,
    validateAndSaveData,
  };
};
