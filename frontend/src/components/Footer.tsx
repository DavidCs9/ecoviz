import { Leaf, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className=" text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex text-sm md:text-base flex-row justify-between items-center">
          <a href="/" className="flex items-center mb-4 md:mb-0">
            <Leaf className="mr-2" />
            <span className="text-lg font-semibold">EcoViz</span>
          </a>

          <div className="flex space-x-4">
            <a
              href="https://github.com/DavidCs9"
              className="hover:text-green-200 transition-colors duration-300"
            >
              <Github />
            </a>
            <a
              href="https://www.linkedin.com/in/davidcastrosiq/"
              className="hover:text-green-200 transition-colors duration-300"
            >
              <Linkedin />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-sm opacity-75">
          &copy; {new Date().getFullYear()} EcoViz. All rights reserved. Made
          with ❤️ by{" "}
          <a href="https://www.linkedin.com/in/davidcastrosiq/">David C</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
