import {
  CalculationData,
  ConsumptionData,
  FoodData,
  HousingData,
  TransportationData,
  AIAnalysisResponse,
  UserInput,
} from './types'

import { aiAnalysisSchema } from './schema/schema'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'

class Calculator {
  llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4.1-nano-2025-04-14',
    temperature: 0.7,
    maxTokens: 1500, // Increased to accommodate full JSON response
  })

  async calculateHandler(userId: string, userInput: UserInput) {
    const data = await this._transformUserInputToCalculationData(userInput)

    const carbonFootprint = this.calculateTotalCarbonFootprint(data)

    const aiAnalysis = await this.getAIAnalysis(carbonFootprint, data)

    const calculationId = `${userId}-${Date.now()}`

    const averages = {
      global: 4000, // 4 tons in kg
      us: 16000, // 16 tons in kg
    }

    return {
      userId,
      calculationId,
      carbonFootprint,
      aiAnalysis,
      averages,
      message: 'Carbon footprint calculation and AI analysis stored successfully ',
    }
  }
  // Placeholder for future methods
  private async _transformUserInputToCalculationData(userInput: UserInput): Promise<CalculationData> {
    console.log('Transforming user input to calculation data')

    // Helper functions for mapping user inputs
    const mapDietDescription = (description: string): string => {
      switch (description) {
        case 'Meat in most meals':
          return 'meat-heavy'
        case 'Meat a few times a week':
          return 'average'
        case 'Vegetarian (no meat)':
          return 'vegetarian'
        case 'Vegan (no animal products)':
          return 'vegan'
        default:
          return 'average'
      }
    }

    const mapShoppingFrequency = (description: string): string => {
      switch (description) {
        case 'I buy new things frequently.':
          return 'frequent'
        case 'I buy new things every now and then.':
          return 'average'
        case 'I rarely buy new things and prefer second-hand.':
          return 'minimal'
        default:
          return 'average'
      }
    }

    const mapRecyclingHabits = (materials: string[]): string => {
      if (materials.includes('None of these')) {
        return 'none'
      }
      if (materials.length >= 3) {
        return 'all'
      }
      if (materials.length >= 1) {
        return 'some'
      }
      return 'none'
    }

    const mapErrandsMiles = (range: string): number => {
      switch (range) {
        case '0-25':
          return 12.5
        case '25-50':
          return 37.5
        case '50-100':
          return 75
        case '100+':
          return 125
        default:
          return 37.5
      }
    }

    // Calculate energy consumption from bills
    const calculateElectricityFromBill = async (monthlyBill: number): Promise<number> => {
      // Default average electricity rate ($/kWh) - from EIA data
      const defaultElectricityRate = 0.16
      try {
        // For now, use default rates. In production, integrate with:
        // - EIA API: https://api.eia.gov/v2/electricity/retail-sales/
        // - Utility company APIs
        // - Commercial energy price services
        console.log('Using default electricity rate for calculation')
        const electricityRate = defaultElectricityRate
        return (monthlyBill * 12) / electricityRate
      } catch (error) {
        console.error('Error calculating electricity usage:', error)
        return (monthlyBill * 12) / defaultElectricityRate
      }
    }

    const calculateNaturalGasFromBill = async (monthlyBill: number): Promise<number> => {
      // Default average natural gas rate ($/therm) - from EIA data
      const defaultGasRate = 1.2
      try {
        // For now, use default rates. In production, integrate with:
        // - EIA API: https://api.eia.gov/v2/natural-gas/pri/sum/
        // - Local utility APIs
        // - Energy data providers
        console.log('Using default natural gas rate for calculation')
        const gasRate = defaultGasRate
        return (monthlyBill * 12) / gasRate
      } catch (error) {
        console.error('Error calculating natural gas usage:', error)
        return (monthlyBill * 12) / defaultGasRate
      }
    }

    const getCarFuelEfficiency = async (make: string, model: string, year: number): Promise<number> => {
      // Default MPG for fallback
      const defaultMPG = 25
      try {
        console.log(`Getting fuel efficiency for ${year} ${make} ${model}`)

        // For now, use enhanced defaults based on common vehicle data
        // In production, integrate with EPA Fuel Economy API:
        // https://www.fueleconomy.gov/feg/ws/index.shtml

        // Enhanced defaults based on common make/model patterns
        const makeUpper = make.toUpperCase()
        const modelUpper = model.toUpperCase()

        // Hybrid/Electric vehicles
        if (modelUpper.includes('PRIUS') || modelUpper.includes('HYBRID')) {
          return year >= 2020 ? 52 : year >= 2010 ? 45 : 40
        }

        // Electric vehicles (use equivalent MPG)
        if (modelUpper.includes('TESLA') || modelUpper.includes('ELECTRIC') || modelUpper.includes('EV')) {
          return 100 // Equivalent MPG for electric
        }

        // Luxury/Large vehicles
        if (
          ['BMW', 'MERCEDES', 'AUDI', 'LEXUS'].includes(makeUpper) ||
          modelUpper.includes('SUV') ||
          modelUpper.includes('TRUCK')
        ) {
          return year >= 2020 ? 22 : year >= 2010 ? 18 : 15
        }

        // Compact/Economy vehicles
        if (
          ['HONDA', 'TOYOTA', 'NISSAN', 'HYUNDAI'].includes(makeUpper) &&
          (modelUpper.includes('CIVIC') ||
            modelUpper.includes('COROLLA') ||
            modelUpper.includes('SENTRA') ||
            modelUpper.includes('ELANTRA'))
        ) {
          return year >= 2020 ? 32 : year >= 2010 ? 28 : 25
        }

        // General year-based improvements
        if (year >= 2020) return 28
        if (year >= 2015) return 26
        if (year >= 2010) return 24
        return 20
      } catch (error) {
        console.error('Error calculating fuel efficiency:', error)
        return defaultMPG
      }
    }

    // Calculate values from user inputs
    const housing = userInput.housing || {}
    const transportation = userInput.transportation || {}
    const food = userInput.food || {}
    const consumption = userInput.consumption || {}
    // const location = userInput.location || {} // TODO: Use for energy price API calls

    // Calculate energy consumption
    const electricityKWh = housing.monthlyElectricityBill
      ? await calculateElectricityFromBill(housing.monthlyElectricityBill)
      : 0

    const naturalGasTerms =
      housing.usesNaturalGas && housing.monthlyNaturalGasBill
        ? await calculateNaturalGasFromBill(housing.monthlyNaturalGasBill)
        : 0

    const heatingOilGallons = housing.usesHeatingOil
      ? (housing.heatingOilFillsPerYear || 0) * (housing.heatingOilTankSizeGallons || 0)
      : 0

    // Calculate transportation
    const car = transportation.car || {}
    const commuteMiles = (car.commuteMilesOneWay || 0) * 2 * (car.commuteDaysPerWeek || 0) * 52
    const errandsMiles = mapErrandsMiles(car.weeklyErrandsMilesRange || '25-50') * 52
    const totalMilesDriven = commuteMiles + errandsMiles

    const fuelEfficiency =
      car.make && car.model && car.year ? await getCarFuelEfficiency(car.make, car.model, car.year) : 25

    const publicTransit = transportation.publicTransit || {}
    const annualBusMiles = (publicTransit.weeklyBusMiles || 0) * 52
    const annualTrainMiles = (publicTransit.weeklyTrainMiles || 0) * 52

    const flights = transportation.flights || {}
    const shortHaulFlights = flights.under3Hours || 0
    const longHaulFlights = (flights.between3And6Hours || 0) + (flights.over6Hours || 0)

    return {
      housing: {
        type: 'apartment', // Default - could be inferred or asked
        size: 1000, // Default - could be inferred from household size
        energy: {
          electricity: electricityKWh,
          naturalGas: naturalGasTerms,
          heatingOil: heatingOilGallons,
        },
      },
      transportation: {
        car: {
          milesDriven: totalMilesDriven,
          fuelEfficiency: fuelEfficiency,
        },
        publicTransit: {
          busMiles: annualBusMiles,
          trainMiles: annualTrainMiles,
        },
        flights: {
          shortHaul: shortHaulFlights,
          longHaul: longHaulFlights,
        },
      },
      food: {
        dietType: mapDietDescription(food.dietDescription || ''),
        wasteLevel: 'average', // Default - could be asked in future
      },
      consumption: {
        shoppingHabits: mapShoppingFrequency(consumption.shoppingFrequencyDescription || ''),
        recyclingHabits: mapRecyclingHabits(consumption.recycledMaterials || []),
      },
    }
  }

  private calculateTotalCarbonFootprint(data: CalculationData): number {
    const housingEmissions = this.calculateHousingEmissions(data.housing)
    const transportationEmissions = this.calculateTransportationEmissions(data.transportation)
    const foodEmissions = this.calculateFoodEmissions(data.food)
    const consumptionEmissions = this.calculateConsumptionEmissions(data.consumption)

    return housingEmissions + transportationEmissions + foodEmissions + consumptionEmissions
  }

  private calculateHousingEmissions(data: HousingData): number {
    const { energy } = data
    const electricityEmissions = energy.electricity * 0.42 // kg CO2 per kWh
    const naturalGasEmissions = energy.naturalGas * 5.3 // kg CO2 per therm
    const heatingOilEmissions = energy.heatingOil * 10.15 // kg CO2 per gallon
    return electricityEmissions + naturalGasEmissions + heatingOilEmissions
  }

  private calculateTransportationEmissions(data: TransportationData): number {
    const { car, publicTransit, flights } = data
    const carEmissions = (car.milesDriven / car.fuelEfficiency) * 8.89 // kg CO2 per gallon of gasoline
    const busEmissions = publicTransit.busMiles * 0.059 // kg CO2 per mile
    const trainEmissions = publicTransit.trainMiles * 0.041 // kg CO2 per mile
    const shortHaulFlightEmissions = flights.shortHaul * 1100 // kg CO2 per flight (assuming average 1500 km flight)
    const longHaulFlightEmissions = flights.longHaul * 4400 // kg CO2 per flight (assuming average 6000 km flight)
    return carEmissions + busEmissions + trainEmissions + shortHaulFlightEmissions + longHaulFlightEmissions
  }

  private calculateFoodEmissions(data: FoodData): number {
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

  private calculateConsumptionEmissions(data: ConsumptionData): number {
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

  private async getAIAnalysis(carbonFootprint: number, data: CalculationData): Promise<AIAnalysisResponse> {
    // Calculate percentage contributions and emissions by category
    const housingEmissions = this.calculateHousingEmissions(data.housing)
    const transportEmissions = this.calculateTransportationEmissions(data.transportation)
    const foodEmissions = this.calculateFoodEmissions(data.food)
    const consumptionEmissions = this.calculateConsumptionEmissions(data.consumption)

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

    // Set up structured output parser with simplified typing to avoid deep type instantiation issues
    const parser = {
      getFormatInstructions: () => `You must respond with a JSON object that matches this exact structure:
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
          const parsed = JSON.parse(text)
          // Validate the parsed result matches our expected structure
          return aiAnalysisSchema.parse(parsed)
        } catch (error) {
          console.error('Failed to parse AI response:', error)
          throw new Error('Invalid AI response format')
        }
      },
    }

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
    const chain = promptTemplate.pipe(this.llm)

    // Prepare the input variables
    const inputVariables = {
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
    }

    // Log the formatted prompt
    const formattedPrompt = await promptTemplate.formatMessages(inputVariables)
    console.log('AI Analysis Prompt:', JSON.stringify(formattedPrompt, null, 2))

    try {
      const llmResult = await chain.invoke(inputVariables)

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
}

export default Calculator
