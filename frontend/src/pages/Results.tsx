/* eslint-disable @typescript-eslint/no-explicit-any */
 
import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { Leaf, Car, Zap, Coffee, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PersistedData } from "../hooks/useDataPersistence";

const RADIAN = Math.PI / 180;

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value.toFixed(1)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [resultData, setResultData] = useState<PersistedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const animatedNumber = useSpring({
    number: resultData?.carbonFootprint || 0,
    from: { number: 0 },
  });

  useEffect(() => {
    const storedData = localStorage.getItem("resultsData");
    if (storedData) {
      setResultData(JSON.parse(storedData));
    } else {
      console.log("No data available, redirecting");
      navigate("/");
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!resultData) {
    return <div>No data available</div>;
  }

  const { carbonFootprint, calculationData, aiAnalysis, averages } = resultData;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const calculateSectorEmissions = () => {
    const housing =
      calculationData.housing.energy.electricity * 0.42 +
      calculationData.housing.energy.naturalGas * 5.3 +
      calculationData.housing.energy.heatingOil * 10.15;

    const transportation =
      (calculationData.transportation.car.milesDriven /
        calculationData.transportation.car.fuelEfficiency) *
        8.89 +
      calculationData.transportation.publicTransit.busMiles * 0.059 +
      calculationData.transportation.publicTransit.trainMiles * 0.041 +
      calculationData.transportation.flights.shortHaul * 1100 +
      calculationData.transportation.flights.longHaul * 4400;

    const foodEmissions = carbonFootprint * 0.25; // Assuming food is roughly 25% of total emissions
    const consumptionEmissions = carbonFootprint * 0.15; // Assuming consumption is roughly 15% of total emissions

    return { housing, transportation, foodEmissions, consumptionEmissions };
  };

  const sectorEmissions = calculateSectorEmissions();

  const data = [
    {
      name: "Housing",
      value: sectorEmissions.housing,
      color: "#4CAF50",
      icon: Zap,
    },
    {
      name: "Transportation",
      value: sectorEmissions.transportation,
      color: "#2196F3",
      icon: Car,
    },
    {
      name: "Food",
      value: sectorEmissions.foodEmissions,
      color: "#FFC107",
      icon: Coffee,
    },
    {
      name: "Consumption",
      value: sectorEmissions.consumptionEmissions,
      color: "#9C27B0",
      icon: ShoppingBag,
    },
  ];

  const comparisonData = [
    { name: "Your Footprint", value: carbonFootprint, fill: "#4CAF50" },
    { name: "Global Average", value: averages.global, fill: "#2196F3" },
    { name: "US Average", value: averages.us, fill: "#FFC107" },
  ];


  return (
    <div className="min-h-screen w-full p-6">
      <div className="md:max-w-4xl mx-auto bg-gradient-to-br from-green-100 to-blue-100 p-6 md:p-10 rounded-lg shadow-lg overflow-hidden text-gray-600">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-green-800">
          Your Carbon Footprint Results
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center mb-8">
          <Leaf className="w-16 h-16 text-green-500 mr-4" />
          <animated.span className="text-4xl md:text-6xl font-bold text-green-700">
            {animatedNumber.number.to((n) => n.toFixed(2))}
          </animated.span>
          <span className="text-2xl ml-2">kg CO2e / year</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="hidden md:block">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">
              Breakdown
            </h2>
            <ResponsiveContainer height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-700">
              Details
            </h2>
            <ul className="space-y-4">
              {data.map((item, index) => (
                <li key={index} className="flex items-center">
                  <item.icon
                    className="w-8 h-8 mr-4"
                    style={{ color: item.color }}
                  />
                  <span className="text-lg">
                    {item.name}: {item.value.toFixed(1)} kg CO2e
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Comparison with Averages
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-lg">
              Your carbon footprint is{" "}
              <strong className="text-green-700">
                {((carbonFootprint / averages.global - 1) * 100).toFixed(1)}%
              </strong>{" "}
              {carbonFootprint > averages.global ? "higher" : "lower"} than the
              global average and{" "}
              <strong className="text-green-700">
                {((carbonFootprint / averages.us - 1) * 100).toFixed(1)}%
              </strong>{" "}
              {carbonFootprint > averages.us ? "higher" : "lower"} than the US
              average.
            </p>
          </div>
        </div>

        {/* AI Analysis Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            AI Analysis Summary
          </h2>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  Comparison to Averages
                </h3>
                <div className="space-y-2">
                  <p className="text-green-900">
                    <span className="font-medium">Global Average:</span>{" "}
                    <span className="font-bold text-green-700">
                      {(aiAnalysis.summary.comparisonToAverages.global * 100).toFixed(1)}%
                    </span>
                  </p>
                  <p className="text-green-900">
                    <span className="font-medium">US Average:</span>{" "}
                    <span className="font-bold text-green-700">
                      {(aiAnalysis.summary.comparisonToAverages.us * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  Top Contributors
                </h3>
                <div className="space-y-2">
                  {aiAnalysis.summary.topContributors.slice(0, 3).map((contributor) => (
                    <div key={contributor.category} className="flex justify-between">
                      <span className="text-green-900 capitalize">{contributor.category}:</span>
                      <span className="font-medium text-green-700">
                        {contributor.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            AI Recommendations
          </h2>
          <div className="space-y-6">
            {aiAnalysis.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-l-4 ${
                  recommendation.priority === 'high'
                    ? 'border-red-500 bg-red-50'
                    : recommendation.priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {recommendation.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      recommendation.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : recommendation.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {recommendation.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{recommendation.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Data Reference</h4>
                    <p className="text-gray-600 text-sm">{recommendation.dataReference}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Goal</h4>
                    <p className="text-gray-600 text-sm">{recommendation.goal}</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Potential Impact</h4>
                  <p className="text-lg font-bold text-green-600">
                    -{recommendation.potentialImpact.co2Reduction} {recommendation.potentialImpact.unit}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Category: <span className="capitalize">{recommendation.category}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="text-center text-sm text-gray-600 mt-8 bg-gray-100/80 p-2 rounded-lg">
          <p>{aiAnalysis.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
