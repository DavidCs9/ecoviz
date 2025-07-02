import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { CalculateRequestSchema } from './validation'
import { CalculationData, ConsumptionData, FoodData, HousingData, TransportationData } from './types'

// Configure Langchain OpenAI
const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo-0125',
  temperature: 0.7,
  maxTokens: 500,
})

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
    const validationResult = CalculateRequestSchema.safeParse(requestBody)
    if (!validationResult.success) {
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

    const carbonFootprint = calculateTotalCarbonFootprint(data)
    const aiAnalysis = await getAIAnalysis(carbonFootprint, data)
    const calculationId = generateCalculationId(userId)
    const averages = {
      global: 4000, // 4 tons in kg
      us: 16000, // 16 tons in kg
    }

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
    console.log(err)
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

async function getAIAnalysis(carbonFootprint: number, data: CalculationData): Promise<string> {
  // Calculate percentage contributions (simplified)
  const totalEmissions = carbonFootprint
  const housingEmissions = data.housing.energy.electricity * 0.4 + data.housing.energy.naturalGas * 5.3
  const transportEmissions =
    data.transportation.car.milesDriven * 0.404 +
    (data.transportation.flights.shortHaul + data.transportation.flights.longHaul) * 1000
  const foodEmissions = data.food.dietType === 'meat-heavy' ? 3000 : data.food.dietType === 'vegetarian' ? 1400 : 2000

  const housingPercentage = (housingEmissions / totalEmissions) * 100
  const transportPercentage = (transportEmissions / totalEmissions) * 100
  const foodPercentage = (foodEmissions / totalEmissions) * 100

  // Identify top two contributors
  const contributors = [
    { name: 'Housing', value: housingPercentage },
    { name: 'Transportation', value: transportPercentage },
    { name: 'Food', value: foodPercentage },
  ]
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)

  // Define the prompt template
  const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      'system',
      "You are a precise environmental sustainability expert. Provide concise, personalized, and actionable recommendations based on the user's specific data. Include potential impact calculations and realistic goals.",
    ],
    [
      'user',
      `Analyze this user's carbon footprint ({carbonFootprint} kg CO2e/year):
      1. Housing ({housingPercentage}%): {housingType}, {housingSize} people, {electricity} kWh electricity, {naturalGas} therms gas
      2. Transportation ({transportPercentage}%): {milesDriven} miles driven, {totalFlights} flights/year
      3. Food ({foodPercentage}%): {dietType} diet, Waste level: {wasteLevel}
      4. Consumption: Shopping habits {shoppingHabits}, Recycling habits {recyclingHabits}
      
      Top contributors: {topContributor1} and {topContributor2}
      
      Provide 3 specific, actionable recommendations to reduce this carbon footprint, focusing on the top contributors. For each recommendation:
      1. Reference specific user data
      2. Estimate the potential CO2e reduction (in kg/year) if implemented
      3. Suggest a realistic goal (e.g., "Reduce car miles by 20%")
      
      Format as a numbered list with each recommendation containing: a) Advice, b) Data reference, c) Potential impact, d) Goal.`,
    ],
  ])

  // Create the chain
  const outputParser = new StringOutputParser()
  const chain = promptTemplate.pipe(llm).pipe(outputParser)

  try {
    const result = await chain.invoke({
      carbonFootprint: carbonFootprint.toFixed(2),
      housingPercentage: housingPercentage.toFixed(1),
      transportPercentage: transportPercentage.toFixed(1),
      foodPercentage: foodPercentage.toFixed(1),
      housingType: data.housing.type,
      housingSize: data.housing.size,
      electricity: data.housing.energy.electricity,
      naturalGas: data.housing.energy.naturalGas,
      milesDriven: data.transportation.car.milesDriven,
      totalFlights: data.transportation.flights.shortHaul + data.transportation.flights.longHaul,
      dietType: data.food.dietType,
      wasteLevel: data.food.wasteLevel,
      shoppingHabits: data.consumption.shoppingHabits,
      recyclingHabits: data.consumption.recyclingHabits,
      topContributor1: contributors[0].name,
      topContributor2: contributors[1].name,
    })

    return result || 'No recommendations available.'
  } catch (error) {
    console.error('Error getting AI analysis:', error)
    return 'Unable to generate recommendations at this time.'
  }
}

function generateCalculationId(userId: string): string {
  return `${userId}-${Date.now()}`
}
