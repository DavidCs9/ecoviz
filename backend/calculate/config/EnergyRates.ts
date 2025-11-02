/**
 * Default energy rates for bill-to-consumption calculations
 * These serve as fallbacks when specific utility rates are not available
 */
export class EnergyRates {
  // Electricity rates ($/kWh) - based on EIA average data
  static readonly DEFAULT_ELECTRICITY_RATE_USD_PER_KWH = 0.16;

  // Natural gas rates ($/therm) - based on EIA average data
  static readonly DEFAULT_NATURAL_GAS_RATE_USD_PER_THERM = 1.2;

  // Calculation periods
  static readonly MONTHS_PER_YEAR = 12;

  /**
   * Calculate annual electricity consumption from monthly bill
   * @param monthlyBill Monthly electricity bill in USD
   * @param ratePerKWh Optional custom rate, uses default if not provided
   * @returns Annual electricity consumption in kWh
   */
  static calculateElectricityUsage(
    monthlyBill: number,
    ratePerKWh: number = EnergyRates.DEFAULT_ELECTRICITY_RATE_USD_PER_KWH
  ): number {
    return (monthlyBill * EnergyRates.MONTHS_PER_YEAR) / ratePerKWh;
  }

  /**
   * Calculate annual natural gas consumption from monthly bill
   * @param monthlyBill Monthly natural gas bill in USD
   * @param ratePerTherm Optional custom rate, uses default if not provided
   * @returns Annual natural gas consumption in therms
   */
  static calculateNaturalGasUsage(
    monthlyBill: number,
    ratePerTherm: number = EnergyRates.DEFAULT_NATURAL_GAS_RATE_USD_PER_THERM
  ): number {
    return (monthlyBill * EnergyRates.MONTHS_PER_YEAR) / ratePerTherm;
  }
}
