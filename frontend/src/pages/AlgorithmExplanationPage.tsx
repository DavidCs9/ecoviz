import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Home, Car, Utensils, ShoppingBag, Zap } from "lucide-react";

const AlgorithmExplanationPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
          How We Calculate Your Carbon Footprint
        </h1>

        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 mb-8 text-white text-balance md:text-pretty">
          <p className="mb-6 text-lg">
            At EcoViz, we believe in transparency. Our carbon footprint
            calculation is based on scientifically accepted emission factors and
            methodologies. Here's a breakdown of how we calculate your personal
            carbon footprint:
          </p>

          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="item-1" className="border-white/20">
              <AccordionTrigger className="text-green-100 hover:text-green-200 md:text-lg">
                Overview of the Calculation Process
              </AccordionTrigger>
              <AccordionContent className="text-green-50">
                <ol className="list-decimal list-inside space-y-2 text-lg">
                  <li>
                    We collect data about your lifestyle through our
                    questionnaire.
                  </li>
                  <li>
                    This data is categorized into four main areas: Housing,
                    Transportation, Food, and Consumption.
                  </li>
                  <li>
                    We apply specific emission factors to your data in each
                    category.
                  </li>
                  <li>
                    The results from each category are summed to give your total
                    carbon footprint.
                  </li>
                  <li>
                    We then use AI to analyze your results and provide
                    personalized recommendations.
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-green-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-green-200">
                  <Home className="mr-2 text-green-300" /> Housing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We calculate emissions based on your energy usage:</p>
                <ul className="list-disc list-inside mt-2 text-green-100 text-sm md:text-base">
                  <li>Electricity: 0.42 kg CO2 per kWh</li>
                  <li>Natural Gas: 5.3 kg CO2 per therm</li>
                  <li>Heating Oil: 10.15 kg CO2 per gallon</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-200">
                  <Car className="mr-2 text-blue-300" /> Transportation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We consider various modes of transport:</p>
                <ul className="list-disc list-inside mt-2 text-blue-100 text-sm md:text-base">
                  <li>Car: 8.89 kg CO2 per gallon of gasoline</li>
                  <li>Bus: 0.059 kg CO2 per mile</li>
                  <li>Train: 0.041 kg CO2 per mile</li>
                  <li>
                    Flights: Short-haul (1100 kg CO2), Long-haul (4400 kg CO2)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-yellow-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-200">
                  <Utensils className="mr-2 text-yellow-300" /> Food
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We factor in your diet type and food waste:</p>
                <ul className="list-disc list-inside mt-2 text-yellow-100 text-sm md:text-base">
                  <li>Diet types: Meat-heavy, Average, Vegetarian, Vegan</li>
                  <li>Food waste levels: Low, Average, High</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-purple-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-200">
                  <ShoppingBag className="mr-2 text-purple-300" /> Consumption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We consider your shopping and recycling habits:</p>
                <ul className="list-disc list-inside mt-2 text-purple-100 text-sm md:text-base">
                  <li>Shopping: Minimal, Average, Frequent</li>
                  <li>Recycling: None, Some, Most, All</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 bg-pink-700 bg-opacity-70 backdrop-filter backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-pink-200">
                <Zap className="mr-2 text-pink-300" /> AI-Powered
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                After calculating your carbon footprint, we use{" "}
                <strong className="text-pink-200">OpenAI's GPT-4 </strong>
                model to analyze your results and generate tailored
                recommendations. This AI considers your specific lifestyle
                choices and suggests the most effective ways for you to reduce
                your environmental impact.
              </p>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-green-100 mt-8 bg-gray-300 bg-opacity-40 p-4 rounded-lg">
            <p>
              Note: Our calculation methods are based on average emission
              factors and may not account for all variables. We continuously
              update our algorithms to improve accuracy. For the most precise
              assessment, consider consulting with a professional environmental
              analyst.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmExplanationPage;
