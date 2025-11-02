import {
  Calculator,
  Car,
  DollarSign,
  Home,
  MapPin,
  Recycle,
  ShoppingBag,
  Utensils,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const AlgorithmExplanationPage = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
        EcoViz Carbon Footprint Algorithm
      </h1>

      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 mb-8 text-white text-balance md:text-pretty">
        <p className="mb-6 text-lg">
          EcoViz uses a comprehensive, multi-stage calculation process to determine your carbon
          footprint. Our algorithm transforms your real-world inputs (bills, commute habits,
          lifestyle choices) into precise emissions calculations across four key categories. Here's
          exactly how our system works:
        </p>

        {/* Input Processing Section */}
        <Card className="mb-8 bg-indigo-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-200">
              <Calculator className="mr-2 text-indigo-300" /> Input Processing & Data Transformation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-indigo-200 mb-2">
                  Bill-to-Consumption Conversion
                </h4>
                <ul className="text-sm text-indigo-100 space-y-1">
                  <li>• Electricity: Monthly bill ÷ $0.16/kWh = Annual kWh</li>
                  <li>• Natural Gas: Monthly bill ÷ $1.20/therm = Annual therms</li>
                  <li>• Heating Oil: Tank fills/year × Tank size = Annual gallons</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-200 mb-2">Transportation Calculations</h4>
                <ul className="text-sm text-indigo-100 space-y-1">
                  <li>• Commute: (One-way miles × 2 × Days/week × 52)</li>
                  <li>• Errands: Weekly range midpoint × 52 weeks</li>
                  <li>• Fuel efficiency: Make/model/year lookup or 25 MPG default</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Calculations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-green-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-green-200">
                <Home className="mr-2 text-green-300" /> Housing Emissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Energy consumption × Emission factors:</p>
              <div className="space-y-2 text-sm">
                <div className="bg-green-600 bg-opacity-40 p-3 rounded">
                  <strong>Electricity:</strong> kWh/year × 0.42 kg CO₂/kWh
                  <br />
                  <span className="text-green-200">US grid average emission factor</span>
                </div>
                <div className="bg-green-600 bg-opacity-40 p-3 rounded">
                  <strong>Natural Gas:</strong> therms/year × 5.3 kg CO₂/therm
                  <br />
                  <span className="text-green-200">Direct combustion emissions</span>
                </div>
                <div className="bg-green-600 bg-opacity-40 p-3 rounded">
                  <strong>Heating Oil:</strong> gallons/year × 10.15 kg CO₂/gallon
                  <br />
                  <span className="text-green-200">Includes combustion + upstream</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-200">
                <Car className="mr-2 text-blue-300" /> Transportation Emissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Multi-modal transportation calculation:</p>
              <div className="space-y-2 text-sm">
                <div className="bg-blue-600 bg-opacity-40 p-3 rounded">
                  <strong>Personal Vehicle:</strong> (Miles driven ÷ MPG) × 8.89 kg CO₂/gallon
                  <br />
                  <span className="text-blue-200">Gasoline combustion factor</span>
                </div>
                <div className="bg-blue-600 bg-opacity-40 p-3 rounded">
                  <strong>Public Transit:</strong>
                  <br />• Bus: Miles × 0.059 kg CO₂/mile
                  <br />• Train: Miles × 0.041 kg CO₂/mile
                </div>
                <div className="bg-blue-600 bg-opacity-40 p-3 rounded">
                  <strong>Aviation:</strong>
                  <br />• Short-haul (&lt;3h): Flights × 1,100 kg CO₂
                  <br />• Long-haul (≥3h): Flights × 4,400 kg CO₂
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-200">
                <Utensils className="mr-2 text-yellow-300" /> Food Emissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Diet-based calculation with waste multiplier:</p>
              <div className="space-y-2 text-sm">
                <div className="bg-yellow-600 bg-opacity-40 p-3 rounded">
                  <strong>Base Formula:</strong> 365 days × Diet factor × Waste factor
                </div>
                <div className="bg-yellow-600 bg-opacity-40 p-3 rounded">
                  <strong>Diet Factors (kg CO₂/day):</strong>
                  <br />• Meat-heavy: 3.3 | Average: 2.5
                  <br />• Vegetarian: 1.7 | Vegan: 1.5
                </div>
                <div className="bg-yellow-600 bg-opacity-40 p-3 rounded">
                  <strong>Waste Multipliers:</strong>
                  <br />• Low: 0.9 | Average: 1.0 | High: 1.1
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-200">
                <ShoppingBag className="mr-2 text-purple-300" /> Consumption Emissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Lifestyle-based consumption model:</p>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-600 bg-opacity-40 p-3 rounded">
                  <strong>Base Formula:</strong> 1,000 kg CO₂ × Shopping factor × Recycling factor
                </div>
                <div className="bg-purple-600 bg-opacity-40 p-3 rounded">
                  <strong>Shopping Multipliers:</strong>
                  <br />• Minimal: 0.5 | Average: 1.0 | Frequent: 1.5
                </div>
                <div className="bg-purple-600 bg-opacity-40 p-3 rounded">
                  <strong>Recycling Multipliers:</strong>
                  <br />• None: 1.2 | Some: 1.0 | Most: 0.8 | All: 0.6
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-teal-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-200">
                <MapPin className="mr-2 text-teal-300" /> Smart Vehicle Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Dynamic MPG calculation based on vehicle data:</p>
              <div className="space-y-2 text-sm">
                <div className="bg-teal-600 bg-opacity-40 p-3 rounded">
                  <strong>Make/Model/Year Lookup:</strong>
                  <br />• Tesla/Hybrid vehicles: High efficiency estimates
                  <br />• Traditional vehicles: Year-based efficiency curves
                  <br />• Fallback: 25 MPG default for unknown vehicles
                </div>
                <div className="bg-teal-600 bg-opacity-40 p-3 rounded">
                  <strong>Year-Based Improvements:</strong>
                  <br />• 2020+: 28 MPG | 2015-2019: 26 MPG
                  <br />• 2010-2014: 24 MPG | Pre-2010: 20 MPG
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-200">
                <Recycle className="mr-2 text-orange-300" /> Intelligent Categorization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Natural language processing for user inputs:</p>
              <div className="space-y-2 text-sm">
                <div className="bg-orange-600 bg-opacity-40 p-3 rounded">
                  <strong>Diet Mapping:</strong>
                  <br />
                  "Meat in most meals" → meat-heavy
                  <br />
                  "Meat a few times a week" → average
                  <br />
                  "Vegetarian/Vegan" → respective categories
                </div>
                <div className="bg-orange-600 bg-opacity-40 p-3 rounded">
                  <strong>Shopping Habits:</strong>
                  <br />
                  "Buy frequently" → frequent (1.5x)
                  <br />
                  "Every now and then" → average (1.0x)
                  <br />
                  "Rarely buy, prefer second-hand" → minimal (0.5x)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis */}
        <Card className="mb-8 bg-pink-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
          <CardHeader>
            <CardTitle className="flex items-center text-pink-200">
              <Zap className="mr-2 text-pink-300" /> AI-Powered Analysis & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-pink-200 mb-3">Emission Analysis</h4>
                <ul className="space-y-2 text-sm text-pink-100">
                  <li>• Calculates percentage contribution by category</li>
                  <li>• Identifies top 3 emission contributors</li>
                  <li>• Compares against global (4,000 kg) and US (16,000 kg) averages</li>
                  <li>• Generates impact ratios and reduction potential</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-pink-200 mb-3">OpenAI GPT-4 Integration</h4>
                <ul className="space-y-2 text-sm text-pink-100">
                  <li>• Analyzes your specific emission profile</li>
                  <li>• Generates 3 personalized recommendations</li>
                  <li>• Estimates CO₂ reduction potential for each action</li>
                  <li>• Prioritizes recommendations by impact (high/medium/low)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="mb-8 bg-gray-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-200">
              <DollarSign className="mr-2 text-gray-300" /> Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-200 mb-3">Backend Architecture</h4>
                <ul className="space-y-1 text-sm text-gray-100">
                  <li>• AWS Lambda serverless functions</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Modular calculation engine</li>
                  <li>• RESTful API design</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200 mb-3">Data Processing</h4>
                <ul className="space-y-1 text-sm text-gray-100">
                  <li>• Input validation & sanitization</li>
                  <li>• Utility bill conversion algorithms</li>
                  <li>• Dynamic vehicle efficiency lookup</li>
                  <li>• Error handling & fallbacks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200 mb-3">Testing & Validation</h4>
                <ul className="space-y-1 text-sm text-gray-100">
                  <li>• Comprehensive unit tests</li>
                  <li>• Calculation verification tests</li>
                  <li>• Edge case handling</li>
                  <li>• Continuous integration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Methodology Note */}
        <div className="text-center text-sm text-green-100 mt-8 bg-gray-300 bg-opacity-40 p-6 rounded-lg">
          <h4 className="font-semibold mb-2">Methodology & Data Sources</h4>
          <p>
            Our emission factors are sourced from EPA guidelines, EIA energy data, and IPCC climate
            research. Utility rate defaults ($0.16/kWh electricity, $1.20/therm gas) are based on US
            Energy Information Administration averages. The algorithm is continuously updated to
            reflect the latest climate science and energy market data. For location-specific
            calculations and enhanced accuracy, consult with certified environmental analysts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmExplanationPage;
