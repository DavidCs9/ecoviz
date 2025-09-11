/**
 * Vehicle fuel efficiency data and estimation logic
 * Provides fallback MPG values when EPA API is not available
 */
export class VehicleData {
  // Default fuel efficiency values
  static readonly DEFAULT_MPG = 25
  static readonly HYBRID_MPG_RANGES = {
    recent: 52, // 2020+
    modern: 45, // 2010-2019
    older: 40, // Pre-2010
  } as const

  static readonly ELECTRIC_EQUIVALENT_MPG = 100

  static readonly LUXURY_LARGE_MPG_RANGES = {
    recent: 22, // 2020+
    modern: 18, // 2010-2019
    older: 15, // Pre-2010
  } as const

  static readonly COMPACT_ECONOMY_MPG_RANGES = {
    recent: 32, // 2020+
    modern: 28, // 2010-2019
    older: 25, // Pre-2010
  } as const

  static readonly GENERAL_MPG_BY_YEAR = {
    2020: 28,
    2015: 26,
    2010: 24,
    fallback: 20,
  } as const

  // Vehicle classification patterns
  static readonly HYBRID_PATTERNS = ['PRIUS', 'HYBRID']
  static readonly ELECTRIC_PATTERNS = ['TESLA', 'ELECTRIC', 'EV']
  static readonly LUXURY_MAKES = ['BMW', 'MERCEDES', 'AUDI', 'LEXUS']
  static readonly LARGE_VEHICLE_PATTERNS = ['SUV', 'TRUCK']
  static readonly ECONOMY_MAKES = ['HONDA', 'TOYOTA', 'NISSAN', 'HYUNDAI']
  static readonly ECONOMY_MODELS = ['CIVIC', 'COROLLA', 'SENTRA', 'ELANTRA']

  // Mileage estimation ranges
  static readonly ERRANDS_MILEAGE_RANGES = {
    '0-25': 12.5,
    '25-50': 37.5,
    '50-100': 75,
    '100+': 125,
    default: 37.5,
  } as const

  // Time calculations
  static readonly WORK_WEEKS_PER_YEAR = 52

  /**
   * Estimate fuel efficiency based on vehicle information
   * @param make Vehicle make
   * @param model Vehicle model
   * @param year Vehicle year
   * @returns Estimated MPG
   */
  static estimateFuelEfficiency(make: string, model: string, year: number): number {
    const makeUpper = make.toUpperCase()
    const modelUpper = model.toUpperCase()

    // Check for hybrid vehicles
    if (this.isHybridVehicle(modelUpper)) {
      return this.getHybridMPG(year)
    }

    // Check for electric vehicles
    if (this.isElectricVehicle(makeUpper, modelUpper)) {
      return this.ELECTRIC_EQUIVALENT_MPG
    }

    // Check for luxury/large vehicles
    if (this.isLuxuryOrLargeVehicle(makeUpper, modelUpper)) {
      return this.getLuxuryLargeMPG(year)
    }

    // Check for compact/economy vehicles
    if (this.isCompactEconomyVehicle(makeUpper, modelUpper)) {
      return this.getCompactEconomyMPG(year)
    }

    // Default based on year
    return this.getGeneralMPGByYear(year)
  }

  /**
   * Calculate errands mileage from range description
   * @param range Range description (e.g., "25-50")
   * @returns Annual errands mileage
   */
  static calculateErrandsMileage(range: string): number {
    const weeklyMiles =
      this.ERRANDS_MILEAGE_RANGES[range as keyof typeof this.ERRANDS_MILEAGE_RANGES] ||
      this.ERRANDS_MILEAGE_RANGES.default
    return weeklyMiles * this.WORK_WEEKS_PER_YEAR
  }

  private static isHybridVehicle(model: string): boolean {
    return this.HYBRID_PATTERNS.some(pattern => model.includes(pattern))
  }

  private static isElectricVehicle(make: string, model: string): boolean {
    return this.ELECTRIC_PATTERNS.some(pattern => make.includes(pattern) || model.includes(pattern))
  }

  private static isLuxuryOrLargeVehicle(make: string, model: string): boolean {
    return this.LUXURY_MAKES.includes(make) || this.LARGE_VEHICLE_PATTERNS.some(pattern => model.includes(pattern))
  }

  private static isCompactEconomyVehicle(make: string, model: string): boolean {
    return this.ECONOMY_MAKES.includes(make) && this.ECONOMY_MODELS.some(modelPattern => model.includes(modelPattern))
  }

  private static getHybridMPG(year: number): number {
    if (year >= 2020) return this.HYBRID_MPG_RANGES.recent
    if (year >= 2010) return this.HYBRID_MPG_RANGES.modern
    return this.HYBRID_MPG_RANGES.older
  }

  private static getLuxuryLargeMPG(year: number): number {
    if (year >= 2020) return this.LUXURY_LARGE_MPG_RANGES.recent
    if (year >= 2010) return this.LUXURY_LARGE_MPG_RANGES.modern
    return this.LUXURY_LARGE_MPG_RANGES.older
  }

  private static getCompactEconomyMPG(year: number): number {
    if (year >= 2020) return this.COMPACT_ECONOMY_MPG_RANGES.recent
    if (year >= 2010) return this.COMPACT_ECONOMY_MPG_RANGES.modern
    return this.COMPACT_ECONOMY_MPG_RANGES.older
  }

  private static getGeneralMPGByYear(year: number): number {
    if (year >= 2020) return this.GENERAL_MPG_BY_YEAR[2020]
    if (year >= 2015) return this.GENERAL_MPG_BY_YEAR[2015]
    if (year >= 2010) return this.GENERAL_MPG_BY_YEAR[2010]
    return this.GENERAL_MPG_BY_YEAR.fallback
  }
}
