import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Progress } from "../components/ui/progress";
import { v4 as uuidv4 } from "uuid";
import { CalculateRequestSchema } from "../../../shared/validation";

const API_URL = import.meta.env.VITE_API_URL;
const steps = ["Housing", "Transportation", "Food", "Consumption"];

const loadingFacts = [
  "Did you know? A single tree can absorb up to 48 pounds of CO2 per year.",
  "Fun fact: The average person generates about 4.5 tons of CO2 per year.",
  "Tip: Reducing your meat consumption can significantly lower your carbon footprint.",
  "Interesting: Renewable energy sources made up 26% of global electricity generation in 2018.",
  "Fact: The transportation sector accounts for about 14% of global greenhouse gas emissions.",
  "Did you know? LED lights use up to 90% less energy than traditional incandescent bulbs.",
  "Tip: Using public transportation can significantly reduce your carbon footprint.",
];

export function Calculator() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState("");
  const [isFinalizingDetails, setIsFinalizingDetails] =
    useState<boolean>(false);
  const [formData, setFormData] = useState({
    housingType: "",
    householdSize: "",
    electricity: "",
    naturalGas: "",
    heatingOil: "",
    milesDriven: "",
    fuelEfficiency: "",
    busMiles: "",
    trainMiles: "",
    shortHaulFlights: "",
    longHaulFlights: "",
    dietType: "",
    foodWaste: "",
    shoppingHabits: "",
    recyclingHabits: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Track when user inputs data
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Track when user selects an option
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;
      // Track when user moves to next step
      return nextStep;
    });
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => {
      const nextStep = prevStep - 1;
      // Track when user moves to previous step
      return nextStep;
    });
  };

  useEffect(() => {
    // Check if user has an ID in localStorage
    let userId = localStorage.getItem("ecoviz_user_id");
    // If not, generate a new UUID and store it
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("ecoviz_user_id", userId);
    }

    let progressInterval: NodeJS.Timeout | undefined;
    let factInterval: NodeJS.Timeout | undefined;

    if (isLoading) {
      setCurrentFact(
        loadingFacts[Math.floor(Math.random() * loadingFacts.length)]
      );

      progressInterval = setInterval(() => {
        setLoadingProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(progressInterval);
            setIsFinalizingDetails(true);
            return 100;
          }
          return oldProgress + 0.5; // Increases by 0.5% every 100ms
        });
      }, 100);

      // Change fact every 5 seconds
      factInterval = setInterval(() => {
        setCurrentFact(
          loadingFacts[Math.floor(Math.random() * loadingFacts.length)]
        );
      }, 5000);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (factInterval) clearInterval(factInterval);
    };
  }, [isLoading]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      const userId = localStorage.getItem("ecoviz_user_id");

      // Create the request payload
      const requestPayload = {
        userId: userId,
        data: {
          housing: {
            type: formData.housingType,
            size: parseInt(formData.householdSize),
            energy: {
              electricity: parseFloat(formData.electricity),
              naturalGas: parseFloat(formData.naturalGas),
              heatingOil: parseFloat(formData.heatingOil),
            },
          },
          transportation: {
            car: {
              milesDriven: parseFloat(formData.milesDriven),
              fuelEfficiency: parseFloat(formData.fuelEfficiency),
            },
            publicTransit: {
              busMiles: parseFloat(formData.busMiles),
              trainMiles: parseFloat(formData.trainMiles),
            },
            flights: {
              shortHaul: parseInt(formData.shortHaulFlights),
              longHaul: parseInt(formData.longHaulFlights),
            },
          },
          food: {
            dietType: formData.dietType,
            wasteLevel: formData.foodWaste,
          },
          consumption: {
            shoppingHabits: formData.shoppingHabits,
            recyclingHabits: formData.recyclingHabits,
          },
        },
      };

      // Validate the request payload using Zod schema
      const validationResult = CalculateRequestSchema.safeParse(requestPayload);
      if (!validationResult.success) {
        console.error("Validation errors:", validationResult.error.issues);
        toast({
          title: "Form Validation Error",
          description: "Please check your inputs and try again.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_URL}/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      const resultsData = {
        carbonFootprint: result.carbonFootprint,
        calculationData: {
          housing: {
            type: formData.housingType,
            size: parseInt(formData.householdSize),
            energy: {
              electricity: parseFloat(formData.electricity),
              naturalGas: parseFloat(formData.naturalGas),
              heatingOil: parseFloat(formData.heatingOil),
            },
          },
          transportation: {
            car: {
              milesDriven: parseFloat(formData.milesDriven),
              fuelEfficiency: parseFloat(formData.fuelEfficiency),
            },
            publicTransit: {
              busMiles: parseFloat(formData.busMiles),
              trainMiles: parseFloat(formData.trainMiles),
            },
            flights: {
              shortHaul: parseInt(formData.shortHaulFlights),
              longHaul: parseInt(formData.longHaulFlights),
            },
          },
          food: {
            dietType: formData.dietType,
            wasteLevel: formData.foodWaste,
          },
          consumption: {
            shoppingHabits: formData.shoppingHabits,
            recyclingHabits: formData.recyclingHabits,
          },
        },
        aiAnalysis: result.aiAnalysis,
        averages: result.averages,
      };

      // Save to localStorage
      localStorage.setItem("resultsData", JSON.stringify(resultsData));

      navigate("/results");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Calculation Failed",
        description: "Failed to calculate carbon footprint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="housingType">Housing Type</Label>
                <Select
                  onValueChange={handleSelectChange("housingType")}
                  value={formData.housingType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select housing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="householdSize">
                  Household Size (number of people)
                </Label>
                <Input
                  type="number"
                  id="householdSize"
                  name="householdSize"
                  value={formData.householdSize}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 for a couple, 4 for a family"
                />
              </div>
              <div>
                <Label htmlFor="electricity">
                  Annual Electricity Usage (kWh)
                </Label>
                <Input
                  type="number"
                  id="electricity"
                  name="electricity"
                  value={formData.electricity}
                  onChange={handleInputChange}
                  placeholder="Average US household: 10,649 kWh/year"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tip: Check your utility bills for monthly usage and multiply
                  by 12
                </p>
              </div>
              <div>
                <Label htmlFor="naturalGas">
                  Annual Natural Gas Usage (therms)
                </Label>
                <Input
                  type="number"
                  id="naturalGas"
                  name="naturalGas"
                  value={formData.naturalGas}
                  onChange={handleInputChange}
                  placeholder="Average US household: 567 therms/year"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tip: 1 therm ≈ 100 cubic feet of natural gas
                </p>
              </div>
              <div>
                <Label htmlFor="heatingOil">
                  Annual Heating Oil Usage (gallons)
                </Label>
                <Input
                  type="number"
                  id="heatingOil"
                  name="heatingOil"
                  value={formData.heatingOil}
                  onChange={handleInputChange}
                  placeholder="Average usage: 540 gallons/year (if applicable)"
                />
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="milesDriven">Annual Miles Driven</Label>
                <Input
                  type="number"
                  id="milesDriven"
                  name="milesDriven"
                  value={formData.milesDriven}
                  onChange={handleInputChange}
                  placeholder="Average US driver: 13,500 miles/year"
                />
              </div>
              <div>
                <Label htmlFor="fuelEfficiency">
                  Car Fuel Efficiency (miles per gallon)
                </Label>
                <Input
                  type="number"
                  id="fuelEfficiency"
                  name="fuelEfficiency"
                  value={formData.fuelEfficiency}
                  onChange={handleInputChange}
                  placeholder="Average new car: 25.7 mpg"
                />
              </div>
              <div>
                <Label htmlFor="busMiles">Annual Bus Miles</Label>
                <Input
                  type="number"
                  id="busMiles"
                  name="busMiles"
                  value={formData.busMiles}
                  onChange={handleInputChange}
                  placeholder="If you commute by bus, estimate your daily miles × 250 workdays"
                />
              </div>
              <div>
                <Label htmlFor="trainMiles">Annual Train Miles</Label>
                <Input
                  type="number"
                  id="trainMiles"
                  name="trainMiles"
                  value={formData.trainMiles}
                  onChange={handleInputChange}
                  placeholder="If you commute by train, estimate your daily miles × 250 workdays"
                />
              </div>
              <div>
                <Label htmlFor="shortHaulFlights">
                  Number of Short Haul Flights per Year (under 3 hours)
                </Label>
                <Input
                  type="number"
                  id="shortHaulFlights"
                  name="shortHaulFlights"
                  value={formData.shortHaulFlights}
                  onChange={handleInputChange}
                  placeholder="e.g., 4 for two round trips"
                />
              </div>
              <div>
                <Label htmlFor="longHaulFlights">
                  Number of Long Haul Flights per Year (over 3 hours)
                </Label>
                <Input
                  type="number"
                  id="longHaulFlights"
                  name="longHaulFlights"
                  value={formData.longHaulFlights}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 for one round trip"
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Diet Type</Label>
                <RadioGroup
                  onValueChange={handleSelectChange("dietType")}
                  value={formData.dietType}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="meat-heavy" id="meat-heavy" />
                    <Label htmlFor="meat-heavy">
                      Meat Heavy (meat at almost every meal)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="average" />
                    <Label htmlFor="average">
                      Average (meat a few times a week)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetarian" id="vegetarian" />
                    <Label htmlFor="vegetarian">
                      Vegetarian (no meat, but consume dairy/eggs)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegan" id="vegan" />
                    <Label htmlFor="vegan">Vegan (no animal products)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Food Waste</Label>
                <RadioGroup
                  onValueChange={handleSelectChange("foodWaste")}
                  value={formData.foodWaste}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low (rarely throw away food)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="average" />
                    <Label htmlFor="average">
                      Average (sometimes throw away leftovers)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">
                      High (often throw away expired or uneaten food)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Shopping Habits</Label>
                <RadioGroup
                  onValueChange={handleSelectChange("shoppingHabits")}
                  value={formData.shoppingHabits}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal">
                      Minimal (buy only necessities)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="average" />
                    <Label htmlFor="average">
                      Average (occasional non-essential purchases)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frequent" id="frequent" />
                    <Label htmlFor="frequent">
                      Frequent (regular non-essential shopping)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Recycling Habits</Label>
                <RadioGroup
                  onValueChange={handleSelectChange("recyclingHabits")}
                  value={formData.recyclingHabits}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">None (don't recycle)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="some" id="some" />
                    <Label htmlFor="some">Some (recycle when convenient)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="most" id="most" />
                    <Label htmlFor="most">
                      Most (regularly recycle common items)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">
                      All (diligently recycle everything possible)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen p-6">
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-green-800">
            Carbon Footprint Calculator
          </CardTitle>
          <CardDescription className="text-green-600">
            {isLoading
              ? isFinalizingDetails
                ? "Finalizing details..."
                : "Calculating your carbon footprint..."
              : `Step ${currentStep + 1} of ${steps.length}: ${
                  steps[currentStep]
                }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Progress value={loadingProgress} className="w-full" />
              <p className="text-center text-green-700">{currentFact}</p>
              {isFinalizingDetails && (
                <p className="text-center text-yellow-600">
                  We're taking a bit longer than usual to ensure accuracy. Thank
                  you for your patience!
                </p>
              )}
            </div>
          ) : (
            renderStep()
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isLoading ? (
            <Button disabled variant="outline" className="w-full">
              {isFinalizingDetails ? "Finalizing..." : "Calculating..."}
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} variant="default">
                  Calculate
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
