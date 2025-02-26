import { Link } from "react-router-dom";
import { Leaf, Calculator, BarChart, Lightbulb } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          EcoViz
        </h1>
        <p className="text-2xl text-green-100 mb-8 font-semibold drop-shadow">
          Calculate, Visualize, and Reduce Your Carbon Footprint
        </p>
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-green-100 mb-4 drop-shadow">
            What We Do
          </h2>
          <p className="text-xl  mb-6 font-medium">
            EcoViz is a powerful tool that helps you understand and minimize
            your environmental impact:
          </p>
          <ul className="text-left text-lg text-white space-y-4 font-medium">
            <li className="flex items-center">
              <Calculator className="mr-2 text-green-300" />{" "}
              <span>Calculate your personal carbon footprint</span>
            </li>
            <li className="flex items-center">
              <BarChart className="mr-2 text-blue-500" />{" "}
              <span>
                Visualize your impact across different areas of your life
              </span>
            </li>
            <li className="flex items-center">
              <Lightbulb className="mr-2 text-yellow-400" />{" "}
              <span>
                Get AI-powered recommendations to reduce your carbon footprint
              </span>
            </li>
          </ul>
        </div>
        <Link
          to="/calculator"
          className="inline-flex items-center px-6 py-3 text-lg font-semibold text-green-700 bg-white rounded-full hover:bg-green-100 transition-colors duration-300 shadow-lg"
        >
          <Leaf className="mr-2 text-green-600" />
          Start Your Carbon Footprint Analysis
        </Link>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Easy to Use",
              description: "Simple questions to gather your lifestyle data",
              titleColor: "text-green-200",
              descColor: "text-green-100",
            },
            {
              title: "Accurate Results",
              description: "Precise calculations based on the latest research",
              titleColor: "text-blue-100",
              descColor: "text-blue-100",
            },
            {
              title: "Actionable Insights",
              description: "Personalized tips to reduce your carbon footprint",
              titleColor: "text-yellow-200",
              descColor: "text-yellow-100",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
            >
              <h2
                className={`text-2xl font-bold mb-2 drop-shadow ${feature.titleColor}`}
              >
                {feature.title}
              </h2>
              <p className={`text-lg font-medium `}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
