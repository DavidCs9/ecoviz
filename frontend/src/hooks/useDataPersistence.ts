import { useState, useEffect } from "react";

interface CalculationData {
  housing: {
    type: string;
    size: number;
    energy: {
      electricity: number;
      naturalGas: number;
      heatingOil: number;
    };
  };
  transportation: {
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
  };
  food: {
    dietType: string;
    wasteLevel: string;
  };
  consumption: {
    shoppingHabits: string;
    recyclingHabits: string;
  };
}

export interface PersistedData {
  carbonFootprint: number;
  calculationData: CalculationData;
  aiAnalysis: string;
  averages: {
    global: number;
    us: number;
  };
}

export const useDataPersistence = () => {
  const [persistedData, setPersistedData] = useState<PersistedData | null>(
    null
  );

  useEffect(() => {
    const storedData = localStorage.getItem("resultsData");
    if (storedData) {
      setPersistedData(JSON.parse(storedData));
    }
  }, []);

  const saveData = (data: PersistedData) => {
    localStorage.setItem("resultsData", JSON.stringify(data));
    setPersistedData(data);
  };

  return { persistedData, saveData };
};
