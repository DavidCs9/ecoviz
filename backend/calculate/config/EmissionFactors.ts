/**
 * Centralized emission factors for carbon footprint calculations
 * All factors are in kg CO2 equivalent per unit
 */
export class EmissionFactors {
  // Housing - Energy emission factors
  static readonly ELECTRICITY_KG_CO2_PER_KWH = 0.42; // kg CO2 per kWh
  static readonly NATURAL_GAS_KG_CO2_PER_THERM = 5.3; // kg CO2 per therm
  static readonly HEATING_OIL_KG_CO2_PER_GALLON = 10.15; // kg CO2 per gallon

  // Transportation emission factors
  static readonly GASOLINE_KG_CO2_PER_GALLON = 8.89; // kg CO2 per gallon of gasoline
  static readonly BUS_KG_CO2_PER_MILE = 0.059; // kg CO2 per mile
  static readonly TRAIN_KG_CO2_PER_MILE = 0.041; // kg CO2 per mile
  static readonly SHORT_HAUL_FLIGHT_KG_CO2 = 1100; // kg CO2 per flight (avg 1500 km)
  static readonly LONG_HAUL_FLIGHT_KG_CO2 = 4400; // kg CO2 per flight (avg 6000 km)

  // Food emission factors (kg CO2 per day)
  static readonly DIET_EMISSION_FACTORS = {
    "meat-heavy": 3.3,
    average: 2.5,
    vegetarian: 1.7,
    vegan: 1.5,
  } as const;

  // Food waste multipliers
  static readonly WASTE_LEVEL_FACTORS = {
    low: 0.9,
    average: 1.0,
    high: 1.1,
  } as const;

  // Consumption emission factors
  static readonly BASE_CONSUMPTION_EMISSIONS_KG_CO2 = 1000; // Base annual consumption emissions

  static readonly SHOPPING_FREQUENCY_FACTORS = {
    minimal: 0.5,
    average: 1.0,
    frequent: 1.5,
  } as const;

  static readonly RECYCLING_HABIT_FACTORS = {
    none: 1.2,
    some: 1.0,
    most: 0.8,
    all: 0.6,
  } as const;

  // Global averages for comparison
  static readonly GLOBAL_AVERAGE_KG_CO2_YEAR = 4000; // 4 tons
  static readonly US_AVERAGE_KG_CO2_YEAR = 16000; // 16 tons

  // Days per year for food calculations
  static readonly DAYS_PER_YEAR = 365;
}
