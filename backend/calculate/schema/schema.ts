import { z } from 'zod'

export const aiAnalysisSchema = z.object({
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
      }),
    ),
  }),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      dataReference: z.string(),
      potentialImpact: z.object({
        co2Reduction: z.number(),
        unit: z.literal('kg/year'),
      }),
      goal: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
      category: z.enum(['housing', 'transportation', 'food', 'consumption']),
    }),
  ),
  disclaimer: z.string(),
})
