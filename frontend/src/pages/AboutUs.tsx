import { BarChart, Box, Brain, Database, type LucideIcon, Server, ShieldCheck } from "lucide-react";

interface TechItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const TechItem: React.FC<TechItemProps> = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-3 p-4 bg-white bg-opacity-10 rounded-lg">
    <Icon className="flex-shrink-0 h-6 w-6 text-green-300" />
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-50">{description}</p>
    </div>
  </div>
);

const AboutEcoViz = () => {
  const technologies = [
    {
      icon: ShieldCheck,
      title: "React & TypeScript",
      description: "Type-safe frontend with modern components",
    },
    {
      icon: Server,
      title: "AWS Lambda",
      description: "Serverless backend for calculations",
    },
    {
      icon: Brain,
      title: "OpenAI GPT-4",
      description: "AI-powered carbon footprint analysis",
    },
    {
      icon: BarChart,
      title: "Recharts",
      description: "Interactive data visualizations",
    },
    {
      icon: Database,
      title: "Radix UI",
      description: "Accessible component library",
    },
    {
      icon: Box,
      title: "Vercel",
      description: "Frontend deployment platform",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">About EcoViz</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-100 mb-4">Our Mission</h2>
        <p className="text-white">
          EcoViz helps you calculate, visualize, and reduce your carbon footprint. We provide
          AI-powered analysis across housing, transportation, food, and consumption with
          personalized recommendations for environmental impact reduction.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-green-200 mb-4">Architecture</h2>
        <ul className="list-disc list-inside text-white space-y-2">
          <li>Serverless AWS Lambda backend with API Gateway</li>
          <li>React & TypeScript frontend with modern tooling</li>
          <li>AI analysis powered by LangChain & OpenAI GPT-4</li>
          <li>Real-time visualizations with Recharts</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-yellow-200 mb-4">Technologies We Use</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <TechItem key={index} {...tech} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutEcoViz;
