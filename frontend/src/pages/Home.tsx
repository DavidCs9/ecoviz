import { Link } from 'react-router-dom'
import { Leaf, Calculator, BarChart, Lightbulb } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 h-full">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col justify-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">EcoViz</h1>
            <p className="text-base md:text-lg text-green-100 mb-4 font-semibold drop-shadow">
              Calculate, Visualize, and Reduce Your Carbon Footprint
            </p>

            {/* What We Do Section - Compact */}
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-4 mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-green-100 mb-3 drop-shadow">What We Do</h2>
              <ul className="text-left text-sm md:text-base text-white space-y-2 font-medium">
                <li className="flex items-center">
                  <Calculator className="mr-2 h-4 w-4 text-green-300 flex-shrink-0" />
                  <span>Calculate your personal carbon footprint</span>
                </li>
                <li className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>Visualize your impact across different areas</span>
                </li>
                <li className="flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span>Get AI-powered recommendations</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <Link
              to="/calculator"
              className="inline-flex items-center px-4 py-2 text-sm md:text-base font-semibold text-green-700 bg-white rounded-full hover:bg-green-100 transition-colors duration-300 shadow-lg"
            >
              <Leaf className="mr-2 h-4 w-4 text-green-600" />
              Start Your Carbon Footprint Analysis
            </Link>
          </div>
        </div>

        {/* Right Column - Feature Cards */}
        <div className="lg:col-span-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                title: 'Easy to Use',
                description: 'Simple questions to gather your lifestyle data',
                titleColor: 'text-green-200',
                icon: Calculator,
              },
              {
                title: 'Accurate Results',
                description: 'Precise calculations based on latest research',
                titleColor: 'text-blue-100',
                icon: BarChart,
              },
              {
                title: 'Actionable Insights',
                description: 'Personalized tips to reduce your footprint',
                titleColor: 'text-yellow-200',
                icon: Lightbulb,
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-lg p-3 shadow-lg"
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className="h-5 w-5 mr-2 text-white" />
                    <h3 className={`text-lg font-bold drop-shadow ${feature.titleColor}`}>{feature.title}</h3>
                  </div>
                  <p className="text-sm text-white font-medium">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
