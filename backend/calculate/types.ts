interface HousingData {
    type: string;
    size: number;
    energy: {
        electricity: number;
        naturalGas: number;
        heatingOil: number;
    };
}

interface TransportationData {
    car: {
        milesDriven: number;
        fuelEfficiency: number;
    };
    publicTransit: {
        busMiles: number;
        trainMiles: number;
    };
    flights: {
        shortHaul: number;
        longHaul: number;
    };
}

interface FoodData {
    dietType: string;
    wasteLevel: string;
}

interface ConsumptionData {
    shoppingHabits: string;
    recyclingHabits: string;
}

interface CalculationData {
    housing: HousingData;
    transportation: TransportationData;
    food: FoodData;
    consumption: ConsumptionData;
}

export { HousingData, TransportationData, FoodData, ConsumptionData, CalculationData };
