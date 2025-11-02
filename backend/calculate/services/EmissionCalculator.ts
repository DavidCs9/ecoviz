import { EmissionFactors } from "../config";
import type {
  CalculationData,
  ConsumptionData,
  FoodData,
  HousingData,
  TransportationData,
} from "../types";

/**
 * Service responsible for calculating carbon emissions from structured data
 * Handles all emission calculations by category using standardized emission factors
 */
export class EmissionCalculator {
  /**
   * Calculate total carbon footprint from all categories
   * @param data Structured calculation data
   * @returns Total carbon emissions in kg CO2 equivalent per year
   */
  calculateTotal(data: CalculationData): number {
    const housingEmissions = this.calculateHousingEmissions(data.housing);
    const transportationEmissions = this.calculateTransportationEmissions(data.transportation);
    const foodEmissions = this.calculateFoodEmissions(data.food);
    const consumptionEmissions = this.calculateConsumptionEmissions(data.consumption);

    return housingEmissions + transportationEmissions + foodEmissions + consumptionEmissions;
  }

  /**
   * Calculate emissions by category for detailed breakdown
   * @param data Structured calculation data
   * @returns Object with emissions by category
   */
  calculateByCategory(data: CalculationData) {
    return {
      housing: this.calculateHousingEmissions(data.housing),
      transportation: this.calculateTransportationEmissions(data.transportation),
      food: this.calculateFoodEmissions(data.food),
      consumption: this.calculateConsumptionEmissions(data.consumption),
    };
  }

  /**
   * Calculate housing-related emissions
   * @param data Housing data including energy consumption
   * @returns Housing emissions in kg CO2 equivalent per year
   */
  calculateHousingEmissions(data: HousingData): number {
    const { energy } = data;
    const electricityEmissions = energy.electricity * EmissionFactors.ELECTRICITY_KG_CO2_PER_KWH;
    const naturalGasEmissions = energy.naturalGas * EmissionFactors.NATURAL_GAS_KG_CO2_PER_THERM;
    const heatingOilEmissions = energy.heatingOil * EmissionFactors.HEATING_OIL_KG_CO2_PER_GALLON;
    return electricityEmissions + naturalGasEmissions + heatingOilEmissions;
  }

  /**
   * Calculate transportation-related emissions
   * @param data Transportation data including car, public transit, and flights
   * @returns Transportation emissions in kg CO2 equivalent per year
   */
  calculateTransportationEmissions(data: TransportationData): number {
    const { car, publicTransit, flights } = data;
    const carEmissions =
      (car.milesDriven / car.fuelEfficiency) * EmissionFactors.GASOLINE_KG_CO2_PER_GALLON;
    const busEmissions = publicTransit.busMiles * EmissionFactors.BUS_KG_CO2_PER_MILE;
    const trainEmissions = publicTransit.trainMiles * EmissionFactors.TRAIN_KG_CO2_PER_MILE;
    const shortHaulFlightEmissions = flights.shortHaul * EmissionFactors.SHORT_HAUL_FLIGHT_KG_CO2;
    const longHaulFlightEmissions = flights.longHaul * EmissionFactors.LONG_HAUL_FLIGHT_KG_CO2;
    return (
      carEmissions +
      busEmissions +
      trainEmissions +
      shortHaulFlightEmissions +
      longHaulFlightEmissions
    );
  }

  /**
   * Calculate food-related emissions
   * @param data Food data including diet type and waste level
   * @returns Food emissions in kg CO2 equivalent per year
   */
  calculateFoodEmissions(data: FoodData): number {
    const baseFoodEmissions =
      EmissionFactors.DAYS_PER_YEAR *
      (EmissionFactors.DIET_EMISSION_FACTORS[
        data.dietType as keyof typeof EmissionFactors.DIET_EMISSION_FACTORS
      ] || EmissionFactors.DIET_EMISSION_FACTORS.average);
    return (
      baseFoodEmissions *
      (EmissionFactors.WASTE_LEVEL_FACTORS[
        data.wasteLevel as keyof typeof EmissionFactors.WASTE_LEVEL_FACTORS
      ] || EmissionFactors.WASTE_LEVEL_FACTORS.average)
    );
  }

  /**
   * Calculate consumption-related emissions
   * @param data Consumption data including shopping habits and recycling
   * @returns Consumption emissions in kg CO2 equivalent per year
   */
  calculateConsumptionEmissions(data: ConsumptionData): number {
    return (
      EmissionFactors.BASE_CONSUMPTION_EMISSIONS_KG_CO2 *
      (EmissionFactors.SHOPPING_FREQUENCY_FACTORS[
        data.shoppingHabits as keyof typeof EmissionFactors.SHOPPING_FREQUENCY_FACTORS
      ] || EmissionFactors.SHOPPING_FREQUENCY_FACTORS.average) *
      (EmissionFactors.RECYCLING_HABIT_FACTORS[
        data.recyclingHabits as keyof typeof EmissionFactors.RECYCLING_HABIT_FACTORS
      ] || EmissionFactors.RECYCLING_HABIT_FACTORS.some)
    );
  }
}
