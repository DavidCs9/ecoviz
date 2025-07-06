import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'
import { CalculateRequestSchema } from './validation'
import {
  CalculationData,
  ConsumptionData,
  FoodData,
  HousingData,
  TransportationData,
  AIAnalysisResponse,
} from './types'

// Configure Langchain OpenAI
const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo-0125',
  temperature: 0.7,
  maxTokens: 1500, // Increased to accommodate full JSON response
})

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Lambda function invoked', {
    httpMethod: event.httpMethod,
    path: event.path,
    requestId: event.requestContext.requestId,
  })

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({
          message: 'Method Not Allowed',
        }),
      }
    }
    const requestBody = JSON.parse(event.body || '{}')

    // Validate request using Zod schema
    console.log('Validating request body')
    const validationResult = CalculateRequestSchema.safeParse(requestBody)
    if (!validationResult.success) {
      console.log('Validation failed', validationResult.error.issues)
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({
          message: 'Invalid request format',
          errors: validationResult.error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        }),
      }
    }

    const { userId, data } = validationResult.data

    console.log('Starting carbon footprint calculation', { userId })
    const carbonFootprint = calculateTotalCarbonFootprint(data)
    console.log('Carbon footprint calculated', { carbonFootprint })

    console.log('Starting AI analysis')
    const aiAnalysis = await getAIAnalysis(carbonFootprint, data)
    console.log('AI analysis completed')

    const calculationId = generateCalculationId(userId)
    const averages = {
      global: 4000, // 4 tons in kg
      us: 16000, // 16 tons in kg
    }

    console.log('Sending successful response', { calculationId, carbonFootprint: carbonFootprint.toFixed(2) })
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        userId,
        calculationId,
        carbonFootprint,
        aiAnalysis,
        averages,
        message: 'Carbon footprint calculation and AI analysis stored successfully ',
      }),
    }
  } catch (err) {
    console.error('Lambda function error:', err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        message: 'some error happened',
      }),
    }
  }
}

function calculateTotalCarbonFootprint(data: CalculationData): number {
  const housingEmissions = calculateHousingEmissions(data.housing)
  const transportationEmissions = calculateTransportationEmissions(data.transportation)
  const foodEmissions = calculateFoodEmissions(data.food)
  const consumptionEmissions = calculateConsumptionEmissions(data.consumption)

  return housingEmissions + transportationEmissions + foodEmissions + consumptionEmissions
}

function calculateHousingEmissions(data: HousingData): number {
  const { energy } = data
  const electricityEmissions = energy.electricity * 0.42 // kg CO2 per kWh
  const naturalGasEmissions = energy.naturalGas * 5.3 // kg CO2 per therm
  const heatingOilEmissions = energy.heatingOil * 10.15 // kg CO2 per gallon
  return electricityEmissions + naturalGasEmissions + heatingOilEmissions
}

function calculateTransportationEmissions(data: TransportationData): number {
  const { car, publicTransit, flights } = data
  const carEmissions = (car.milesDriven / car.fuelEfficiency) * 8.89 // kg CO2 per gallon of gasoline
  const busEmissions = publicTransit.busMiles * 0.059 // kg CO2 per mile
  const trainEmissions = publicTransit.trainMiles * 0.041 // kg CO2 per mile
  const shortHaulFlightEmissions = flights.shortHaul * 1100 // kg CO2 per flight (assuming average 1500 km flight)
  const longHaulFlightEmissions = flights.longHaul * 4400 // kg CO2 per flight (assuming average 6000 km flight)
  return carEmissions + busEmissions + trainEmissions + shortHaulFlightEmissions + longHaulFlightEmissions
}

function calculateFoodEmissions(data: FoodData): number {
  const dietFactors = {
    'meat-heavy': 3.3,
    average: 2.5,
    vegetarian: 1.7,
    vegan: 1.5,
  }
  const wasteFactors = {
    low: 0.9,
    average: 1.0,
    high: 1.1,
  }
  const baseFoodEmissions = 365 * (dietFactors[data.dietType as keyof typeof dietFactors] || 2.5)
  return baseFoodEmissions * (wasteFactors[data.wasteLevel as keyof typeof wasteFactors] || 1.0)
}

function calculateConsumptionEmissions(data: ConsumptionData): number {
  const shoppingFactors = {
    minimal: 0.5,
    average: 1.0,
    frequent: 1.5,
  }
  const recyclingFactors = {
    none: 1.2,
    some: 1.0,
    most: 0.8,
    all: 0.6,
  }
  const baseConsumptionEmissions = 1000 // Assume 1000 kg CO2 for average consumption
  return (
    baseConsumptionEmissions *
    (shoppingFactors[data.shoppingHabits as keyof typeof shoppingFactors] || 1.0) *
    (recyclingFactors[data.recyclingHabits as keyof typeof recyclingFactors] || 1.0)
  )
}

// Define the Zod schema for structured output
const aiAnalysisSchema = z.object({
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

async function getAIAnalysis(carbonFootprint: number, data: CalculationData): Promise<AIAnalysisResponse> {
  // Calculate percentage contributions and emissions by category
  const housingEmissions = calculateHousingEmissions(data.housing)
  const transportEmissions = calculateTransportationEmissions(data.transportation)
  const foodEmissions = calculateFoodEmissions(data.food)
  const consumptionEmissions = calculateConsumptionEmissions(data.consumption)

  const housingPercentage = (housingEmissions / carbonFootprint) * 100
  const transportPercentage = (transportEmissions / carbonFootprint) * 100
  const foodPercentage = (foodEmissions / carbonFootprint) * 100
  const consumptionPercentage = (consumptionEmissions / carbonFootprint) * 100

  // Identify top contributors
  const contributors = [
    { category: 'housing', percentage: housingPercentage, emissions: housingEmissions },
    { category: 'transportation', percentage: transportPercentage, emissions: transportEmissions },
    { category: 'food', percentage: foodPercentage, emissions: foodEmissions },
    { category: 'consumption', percentage: consumptionPercentage, emissions: consumptionEmissions },
  ].sort((a, b) => b.percentage - a.percentage)

  // Create fallback response for when AI is not available
  const createFallbackResponse = (): AIAnalysisResponse => ({
    summary: {
      totalEmissions: carbonFootprint,
      comparisonToAverages: {
        global: carbonFootprint / 4000,
        us: carbonFootprint / 16000,
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
          unit: 'kg/year' as const,
        },
        goal: `Reduce ${contributors[0].category} emissions by 20%`,
        priority: 'high' as const,
        category: contributors[0].category as 'housing' | 'transportation' | 'food' | 'consumption',
      },
      {
        title: `Optimize ${contributors[1].category.charAt(0).toUpperCase() + contributors[1].category.slice(1)}`,
        description: `Your second largest contributor is ${contributors[1].category} at ${contributors[1].percentage.toFixed(1)}% of emissions.`,
        dataReference: `Based on your ${contributors[1].category} data`,
        potentialImpact: {
          co2Reduction: Math.round(contributors[1].emissions * 0.15),
          unit: 'kg/year' as const,
        },
        goal: `Reduce ${contributors[1].category} emissions by 15%`,
        priority: 'medium' as const,
        category: contributors[1].category as 'housing' | 'transportation' | 'food' | 'consumption',
      },
    ],
    disclaimer:
      'These recommendations are generated based on your emission profile and should be considered as general advice. Consult environmental experts for personalized strategies.',
  })

  // If no OpenAI API key is provided or in test environment, return fallback
  if (!process.env.OPENAI_API_KEY || process.env.NODE_ENV === 'test') {
    return createFallbackResponse()
  }

  // Set up structured output parser
  const parser = StructuredOutputParser.fromZodSchema(aiAnalysisSchema)

  // Define the prompt template
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      'system',
      'You are a precise environmental sustainability expert. Analyze carbon footprint data and provide structured recommendations.\n\nIMPORTANT: Respond with ONLY pure JSON - no markdown code blocks, no ```json tags, no additional text. Just the raw JSON object.\n\n{formatInstructions}',
    ],
    [
      'user',
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
  ])

  // Create the chain with custom parsing to handle markdown code blocks
  const chain = promptTemplate.pipe(llm)

  try {
    const llmResult = await chain.invoke({
      formatInstructions: parser.getFormatInstructions(),
      carbonFootprint: carbonFootprint.toFixed(0),
      housingEmissions: housingEmissions.toFixed(0),
      transportEmissions: transportEmissions.toFixed(0),
      foodEmissions: foodEmissions.toFixed(0),
      consumptionEmissions: consumptionEmissions.toFixed(0),
      housingPercentage: housingPercentage.toFixed(1),
      transportPercentage: transportPercentage.toFixed(1),
      foodPercentage: foodPercentage.toFixed(1),
      consumptionPercentage: consumptionPercentage.toFixed(1),
      housingType: data.housing.type,
      electricity: data.housing.energy.electricity,
      naturalGas: data.housing.energy.naturalGas,
      milesDriven: data.transportation.car.milesDriven,
      totalFlights: data.transportation.flights.shortHaul + data.transportation.flights.longHaul,
      dietType: data.food.dietType,
      wasteLevel: data.food.wasteLevel,
      shoppingHabits: data.consumption.shoppingHabits,
      recyclingHabits: data.consumption.recyclingHabits,
    })

    // Clean the response by removing markdown code blocks if present
    let cleanedContent = typeof llmResult.content === 'string' ? llmResult.content : JSON.stringify(llmResult.content)

    // Remove ```json and ``` markdown blocks
    cleanedContent = cleanedContent
      .replace(/^```json\s*\n?/, '')
      .replace(/\n?\s*```\s*$/, '')
      .trim()

    // Normalize category values to lowercase to match schema
    cleanedContent = cleanedContent
      .replace(/"category":\s*"Transportation"/g, '"category": "transportation"')
      .replace(/"category":\s*"Housing"/g, '"category": "housing"')
      .replace(/"category":\s*"Food"/g, '"category": "food"')
      .replace(/"category":\s*"Consumption"/g, '"category": "consumption"')

    // Parse the cleaned JSON
    const result = parser.parse(cleanedContent)
    return result
  } catch (error) {
    console.error('Error getting AI analysis:', error)
    // Return fallback structured response on AI failure
    return createFallbackResponse()
  }
}

function generateCalculationId(userId: string): string {
  return `${userId}-${Date.now()}`
}
