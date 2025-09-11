/**
 * Input mapping utilities for transforming user input strings to standardized values
 */
export class InputMappings {
  /**
   * Map diet description to standardized diet type
   * @param description User-provided diet description
   * @returns Standardized diet type
   */
  static mapDietDescription(description: string): string {
    const dietMap: Record<string, string> = {
      'Meat in most meals': 'meat-heavy',
      'Meat a few times a week': 'average',
      'Vegetarian (no meat)': 'vegetarian',
      'Vegan (no animal products)': 'vegan',
    }
    return dietMap[description] || 'average'
  }

  /**
   * Map shopping frequency description to standardized shopping habits
   * @param description User-provided shopping frequency description
   * @returns Standardized shopping habits
   */
  static mapShoppingFrequency(description: string): string {
    const shoppingMap: Record<string, string> = {
      'I buy new things frequently.': 'frequent',
      'I buy new things every now and then.': 'average',
      'I rarely buy new things and prefer second-hand.': 'minimal',
    }
    return shoppingMap[description] || 'average'
  }

  /**
   * Map recycling materials array to standardized recycling habits
   * @param materials Array of recycled materials
   * @returns Standardized recycling habits
   */
  static mapRecyclingHabits(materials: string[]): string {
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
}
