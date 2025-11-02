import { EnergyRates, InputMappings, VehicleData } from "../config";
import type { CalculationData, UserInput } from "../types";

/**
 * Service responsible for transforming user input into standardized calculation data
 * Handles data validation, mapping, and energy consumption calculations
 */
export class InputTransformer {
  /**
   * Transform user input into structured calculation data
   * @param userInput Raw user input from the frontend
   * @returns Promise<CalculationData> Structured data ready for calculations
   */
  async transform(userInput: UserInput): Promise<CalculationData> {
    console.log("Transforming user input to calculation data");

    // Extract input sections with defaults
    const housing = userInput.housing || {};
    const transportation = userInput.transportation || {};
    const food = userInput.food || {};
    const consumption = userInput.consumption || {};

    // Transform housing data
    const housingData = await this.transformHousingData(housing);

    // Transform transportation data
    const transportationData = await this.transformTransportationData(transportation);

    // Transform food data
    const foodData = this.transformFoodData(food);

    // Transform consumption data
    const consumptionData = this.transformConsumptionData(consumption);

    return {
      housing: housingData,
      transportation: transportationData,
      food: foodData,
      consumption: consumptionData,
    };
  }

  /**
   * Transform housing input to housing calculation data
   */
  private async transformHousingData(housing: NonNullable<UserInput["housing"]>) {
    // Calculate energy consumption from bills
    const electricityKWh = housing.monthlyElectricityBill
      ? EnergyRates.calculateElectricityUsage(housing.monthlyElectricityBill)
      : 0;

    const naturalGasTerms =
      housing.usesNaturalGas && housing.monthlyNaturalGasBill
        ? EnergyRates.calculateNaturalGasUsage(housing.monthlyNaturalGasBill)
        : 0;

    const heatingOilGallons = housing.usesHeatingOil
      ? (housing.heatingOilFillsPerYear || 0) * (housing.heatingOilTankSizeGallons || 0)
      : 0;

    return {
      type: "apartment", // Default - could be inferred or asked
      size: 1000, // Default - could be inferred from household size
      energy: {
        electricity: electricityKWh,
        naturalGas: naturalGasTerms,
        heatingOil: heatingOilGallons,
      },
    };
  }

  /**
   * Transform transportation input to transportation calculation data
   */
  private async transformTransportationData(
    transportation: NonNullable<UserInput["transportation"]>
  ) {
    // Car data transformation
    const car = transportation.car || {};
    const commuteMiles =
      (car.commuteMilesOneWay || 0) *
      2 *
      (car.commuteDaysPerWeek || 0) *
      VehicleData.WORK_WEEKS_PER_YEAR;
    const errandsMiles = VehicleData.calculateErrandsMileage(
      car.weeklyErrandsMilesRange || "25-50"
    );
    const totalMilesDriven = commuteMiles + errandsMiles;

    const fuelEfficiency =
      car.make && car.model && car.year
        ? VehicleData.estimateFuelEfficiency(car.make, car.model, car.year)
        : VehicleData.DEFAULT_MPG;

    // Public transit data transformation
    const publicTransit = transportation.publicTransit || {};
    const annualBusMiles = (publicTransit.weeklyBusMiles || 0) * VehicleData.WORK_WEEKS_PER_YEAR;
    const annualTrainMiles =
      (publicTransit.weeklyTrainMiles || 0) * VehicleData.WORK_WEEKS_PER_YEAR;

    // Flight data transformation
    const flights = transportation.flights || {};
    const shortHaulFlights = flights.under3Hours || 0;
    const longHaulFlights = (flights.between3And6Hours || 0) + (flights.over6Hours || 0);

    return {
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
    };
  }

  /**
   * Transform food input to food calculation data
   */
  private transformFoodData(food: NonNullable<UserInput["food"]>) {
    return {
      dietType: InputMappings.mapDietDescription(food.dietDescription || ""),
      wasteLevel: "average", // Default - could be asked in future
    };
  }

  /**
   * Transform consumption input to consumption calculation data
   */
  private transformConsumptionData(consumption: NonNullable<UserInput["consumption"]>) {
    return {
      shoppingHabits: InputMappings.mapShoppingFrequency(
        consumption.shoppingFrequencyDescription || ""
      ),
      recyclingHabits: InputMappings.mapRecyclingHabits(consumption.recycledMaterials || []),
    };
  }
}
