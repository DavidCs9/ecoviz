import { UserInput } from './types'
import { EmissionFactors } from './config'
import { InputTransformer, EmissionCalculator, AIAnalysisService } from './services'

/**
 * Main calculator orchestrator that coordinates specialized services
 * Handles the overall calculation workflow and result assembly
 */
class Calculator {
  private inputTransformer: InputTransformer
  private emissionCalculator: EmissionCalculator
  private aiAnalysisService: AIAnalysisService

  constructor() {
    this.inputTransformer = new InputTransformer()
    this.emissionCalculator = new EmissionCalculator()
    this.aiAnalysisService = new AIAnalysisService()
  }

  /**
   * Main calculation handler that orchestrates the entire carbon footprint calculation workflow
   * @param userId User identifier
   * @param userInput Raw user input from the frontend
   * @returns Complete calculation results with AI analysis
   */
  async calculateHandler(userId: string, userInput: UserInput) {
    // Step 1: Transform user input into structured calculation data
    const data = await this.inputTransformer.transform(userInput)

    // Step 2: Calculate carbon footprint
    const carbonFootprint = this.emissionCalculator.calculateTotal(data)
    const emissionsByCategory = this.emissionCalculator.calculateByCategory(data)

    // Step 3: Generate AI analysis
    const aiAnalysis = await this.aiAnalysisService.generateAnalysis(carbonFootprint, data, emissionsByCategory)

    // Step 4: Assemble final result
    const calculationId = `${userId}-${Date.now()}`
    const averages = {
      global: EmissionFactors.GLOBAL_AVERAGE_KG_CO2_YEAR,
      us: EmissionFactors.US_AVERAGE_KG_CO2_YEAR,
    }

    return {
      userId,
      calculationId,
      carbonFootprint,
      aiAnalysis,
      averages,
      message: 'Carbon footprint calculation and AI analysis stored successfully',
    }
  }
}

export default Calculator
