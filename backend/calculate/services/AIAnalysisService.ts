import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { EmissionFactors } from "../config";
import { aiAnalysisSchema } from "../schema/schema";
import type { AIAnalysisResponse, CalculationData } from "../types";

/**
 * Service responsible for AI-powered carbon footprint analysis
 * Integrates with OpenAI to provide personalized recommendations
 */
export class AIAnalysisService {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4.1-nano-2025-04-14",
      temperature: 0.7,
      maxTokens: 1500,
    });
  }

  /**
   * Generate AI analysis and recommendations for carbon footprint
   * @param carbonFootprint Total carbon footprint in kg CO2
   * @param data Calculation data for context
   * @param emissionsByCategory Emissions broken down by category
   * @returns AI analysis with recommendations
   */
  async generateAnalysis(
    carbonFootprint: number,
    data: CalculationData,
    emissionsByCategory: {
      housing: number;
      transportation: number;
      food: number;
      consumption: number;
    }
  ): Promise<AIAnalysisResponse> {
    // Calculate percentage contributions
    const percentages = this.calculatePercentages(carbonFootprint, emissionsByCategory);

    // Identify top contributors
    const contributors = this.identifyTopContributors(emissionsByCategory, percentages);

    // Create fallback response for when AI is not available
    const fallbackResponse = this.createFallbackResponse(carbonFootprint, contributors);

    // If no OpenAI API key is provided or in test environment, return fallback
    if (!process.env.OPENAI_API_KEY || process.env.NODE_ENV === "test") {
      return fallbackResponse;
    }

    try {
      return await this.callOpenAI(carbonFootprint, data, emissionsByCategory, percentages);
    } catch (error) {
      console.error("Error getting AI analysis:", error);
      return fallbackResponse;
    }
  }

  /**
   * Calculate percentage contribution of each category
   */
  private calculatePercentages(
    totalEmissions: number,
    emissions: { housing: number; transportation: number; food: number; consumption: number }
  ) {
    return {
      housing: (emissions.housing / totalEmissions) * 100,
      transportation: (emissions.transportation / totalEmissions) * 100,
      food: (emissions.food / totalEmissions) * 100,
      consumption: (emissions.consumption / totalEmissions) * 100,
    };
  }

  /**
   * Identify top contributing categories
   */
  private identifyTopContributors(
    emissions: { housing: number; transportation: number; food: number; consumption: number },
    percentages: { housing: number; transportation: number; food: number; consumption: number }
  ) {
    return [
      { category: "housing", percentage: percentages.housing, emissions: emissions.housing },
      {
        category: "transportation",
        percentage: percentages.transportation,
        emissions: emissions.transportation,
      },
      { category: "food", percentage: percentages.food, emissions: emissions.food },
      {
        category: "consumption",
        percentage: percentages.consumption,
        emissions: emissions.consumption,
      },
    ].sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * Create fallback response when AI is not available
   */
  private createFallbackResponse(
    carbonFootprint: number,
    contributors: Array<{ category: string; percentage: number; emissions: number }>
  ): AIAnalysisResponse {
    return {
      summary: {
        totalEmissions: carbonFootprint,
        comparisonToAverages: {
          global: carbonFootprint / EmissionFactors.GLOBAL_AVERAGE_KG_CO2_YEAR,
          us: carbonFootprint / EmissionFactors.US_AVERAGE_KG_CO2_YEAR,
        },
        topContributors: contributors.slice(0, 3),
      },
      recommendations: [
        {
          title: `Reduce ${contributors[0].category.charAt(0).toUpperCase() + contributors[0].category.slice(1)} Emissions`,
          description: `Your largest contributor is ${contributors[0].category} at ${contributors[0].percentage.toFixed(1)}% of your total emissions.`,
          dataReference: `Based on your ${contributors[0].category} data`,
          potentialImpact: {
            co2Reduction: Math.round(contributors[0].emissions * 0.2),
            unit: "kg/year" as const,
          },
          goal: `Reduce ${contributors[0].category} emissions by 20%`,
          priority: "high" as const,
          category: contributors[0].category as
            | "housing"
            | "transportation"
            | "food"
            | "consumption",
        },
        {
          title: `Optimize ${contributors[1].category.charAt(0).toUpperCase() + contributors[1].category.slice(1)}`,
          description: `Your second largest contributor is ${contributors[1].category} at ${contributors[1].percentage.toFixed(1)}% of emissions.`,
          dataReference: `Based on your ${contributors[1].category} data`,
          potentialImpact: {
            co2Reduction: Math.round(contributors[1].emissions * 0.15),
            unit: "kg/year" as const,
          },
          goal: `Reduce ${contributors[1].category} emissions by 15%`,
          priority: "medium" as const,
          category: contributors[1].category as
            | "housing"
            | "transportation"
            | "food"
            | "consumption",
        },
      ],
      disclaimer:
        "These recommendations are generated based on your emission profile and should be considered as general advice. Consult environmental experts for personalized strategies.",
    };
  }

  /**
   * Call OpenAI API for AI analysis
   */
  private async callOpenAI(
    carbonFootprint: number,
    data: CalculationData,
    emissions: { housing: number; transportation: number; food: number; consumption: number },
    percentages: { housing: number; transportation: number; food: number; consumption: number }
  ): Promise<AIAnalysisResponse> {
    const parser = this.createParser();
    const promptTemplate = this.createPromptTemplate();
    const chain = promptTemplate.pipe(this.llm);

    const inputVariables = this.prepareInputVariables(
      carbonFootprint,
      data,
      emissions,
      percentages,
      parser
    );

    // Log the formatted prompt for debugging
    const formattedPrompt = await promptTemplate.formatMessages(inputVariables);
    console.log("AI Analysis Prompt:", JSON.stringify(formattedPrompt, null, 2));

    const llmResult = await chain.invoke(inputVariables);

    // Clean and parse the response
    let cleanedContent =
      typeof llmResult.content === "string" ? llmResult.content : JSON.stringify(llmResult.content);

    // Remove markdown code blocks if present
    cleanedContent = cleanedContent
      .replace(/^```json\s*\n?/, "")
      .replace(/\n?\s*```\s*$/, "")
      .trim();

    // Normalize category values to lowercase to match schema
    cleanedContent = cleanedContent
      .replace(/"category":\s*"Transportation"/g, '"category": "transportation"')
      .replace(/"category":\s*"Housing"/g, '"category": "housing"')
      .replace(/"category":\s*"Food"/g, '"category": "food"')
      .replace(/"category":\s*"Consumption"/g, '"category": "consumption"');

    return parser.parse(cleanedContent);
  }

  /**
   * Create response parser
   */
  private createParser() {
    return {
      getFormatInstructions:
        () => `You must respond with a JSON object that matches this exact structure:
{
  "summary": {
    "totalEmissions": number,
    "comparisonToAverages": {
      "global": number,
      "us": number
    },
    "topContributors": [
      {
        "category": string,
        "percentage": number,
        "emissions": number
      }
    ]
  },
  "recommendations": [
    {
      "title": string,
      "description": string,
      "dataReference": string,
      "potentialImpact": {
        "co2Reduction": number,
        "unit": "kg/year"
      },
      "goal": string,
      "priority": "high" | "medium" | "low",
      "category": "housing" | "transportation" | "food" | "consumption"
    }
  ],
  "disclaimer": string
}`,
      parse: (text: string): AIAnalysisResponse => {
        try {
          const parsed = JSON.parse(text);
          return aiAnalysisSchema.parse(parsed);
        } catch (error) {
          console.error("Failed to parse AI response:", error);
          throw new Error("Invalid AI response format");
        }
      },
    };
  }

  /**
   * Create prompt template for AI analysis
   */
  private createPromptTemplate() {
    return ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a precise environmental sustainability expert. Analyze carbon footprint data and provide structured recommendations.\n\nIMPORTANT: Respond with ONLY pure JSON - no markdown code blocks, no ```json tags, no additional text. Just the raw JSON object.\n\n{formatInstructions}",
      ],
      [
        "user",
        `Analyze this user's carbon footprint ({carbonFootprint} kg CO2e/year):
  
        Emissions by category:
        - Housing: {housingEmissions} kg CO2e/year ({housingPercentage}%) - {housingType}, {electricity} kWh electricity, {naturalGas} therms gas
        - Transportation: {transportEmissions} kg CO2e/year ({transportPercentage}%) - {milesDriven} miles driven, {totalFlights} flights/year
        - Food: {foodEmissions} kg CO2e/year ({foodPercentage}%) - {dietType} diet, {wasteLevel} waste level
        - Consumption: {consumptionEmissions} kg CO2e/year ({consumptionPercentage}%) - {shoppingHabits} shopping, {recyclingHabits} recycling
        
        Global average: 4000 kg CO2e/year
        US average: 16000 kg CO2e/year
        
        Provide a structured analysis with:
        1. Summary with emissions comparison and top 3 contributors
        2. 3 specific, actionable recommendations focusing on the highest impact categories
        3. Include potential CO2 reduction estimates and realistic goals for each recommendation
        4. Set appropriate priority levels (high/medium/low) based on impact potential
        5. Include a standard disclaimer about AI-generated advice
  
        IMPORTANT: Use exact lowercase values for category fields:
        - "housing" (not "Housing")
        - "transportation" (not "Transportation") 
        - "food" (not "Food")
        - "consumption" (not "Consumption")
  
        Respond with ONLY the JSON object, no markdown formatting.`,
      ],
    ]);
  }

  /**
   * Prepare input variables for the prompt
   */
  private prepareInputVariables(
    carbonFootprint: number,
    data: CalculationData,
    emissions: { housing: number; transportation: number; food: number; consumption: number },
    percentages: { housing: number; transportation: number; food: number; consumption: number },
    parser: { getFormatInstructions: () => string }
  ) {
    return {
      formatInstructions: parser.getFormatInstructions(),
      carbonFootprint: carbonFootprint.toFixed(0),
      housingEmissions: emissions.housing.toFixed(0),
      transportEmissions: emissions.transportation.toFixed(0),
      foodEmissions: emissions.food.toFixed(0),
      consumptionEmissions: emissions.consumption.toFixed(0),
      housingPercentage: percentages.housing.toFixed(1),
      transportPercentage: percentages.transportation.toFixed(1),
      foodPercentage: percentages.food.toFixed(1),
      consumptionPercentage: percentages.consumption.toFixed(1),
      housingType: data.housing.type,
      electricity: data.housing.energy.electricity,
      naturalGas: data.housing.energy.naturalGas,
      milesDriven: data.transportation.car.milesDriven,
      totalFlights: data.transportation.flights.shortHaul + data.transportation.flights.longHaul,
      dietType: data.food.dietType,
      wasteLevel: data.food.wasteLevel,
      shoppingHabits: data.consumption.shoppingHabits,
      recyclingHabits: data.consumption.recyclingHabits,
    };
  }
}
