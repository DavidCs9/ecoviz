import {
  ShieldCheck,
  Server,
  Database,
  Brain,
  Cpu,
  BarChart,
  Box,
  AlertTriangle,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

interface TechItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const TechItem: React.FC<TechItemProps> = ({
  icon: Icon,
  title,
  description,
}) => (
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
      title: "React & Vite",
      description: "Modern frontend framework for a responsive UI",
    },
    {
      icon: Server,
      title: "Node.js & Express",
      description: "Efficient backend services",
    },
    {
      icon: Database,
      title: "Amazon DynamoDB",
      description: "Scalable NoSQL database for data storage",
    },
    {
      icon: Cpu,
      title: "AWS Services",
      description: "Reliable cloud infrastructure (EC2, API Gateway, etc.)",
    },
    {
      icon: Brain,
      title: "OpenAI API",
      description: "AI-powered recommendations",
    },
    {
      icon: BarChart,
      title: "PostHog",
      description: "Product analytics for user insights",
    },
    {
      icon: Box,
      title: "Docker",
      description: "Containerization for consistent deployments",
    },
    {
      icon: AlertTriangle,
      title: "Sentry",
      description: "Real-time error tracking and monitoring",
    },
  ];

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          About EcoViz
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-100 mb-4">
            Our Mission
          </h2>
          <p className="text-white mb-4">
            EcoViz was born from a passion for environmental sustainability and
            the belief that individual actions can make a significant impact.
            Our mission is to empower people with the knowledge and tools they
            need to understand and reduce their carbon footprint.
          </p>
          <p className="text-white">
            By providing an easy-to-use calculator, intuitive visualizations,
            and AI-powered recommendations, we aim to make environmental
            consciousness accessible and actionable for everyone.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-green-200 mb-4">
            Why We Built It
          </h2>
          <ul className="list-disc list-inside text-white space-y-2">
            <li>To raise awareness about individual carbon footprints</li>
            <li>
              To provide actionable insights for reducing environmental impact
            </li>
            <li>To leverage technology in the fight against climate change</li>
            <li>
              To create a community of environmentally conscious individuals
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-yellow-200 mb-4">
            Technologies We Use
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <TechItem key={index} {...tech} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutEcoViz;
