import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { Calculator } from "./pages/Calculator";
import Results from "./pages/Results";
import AboutEcoViz from "./pages/AboutUs";
import AlgorithmExplanationPage from "./pages/AlgorithmExplanationPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<AboutEcoViz />} />
            <Route
              path="/how-it-works"
              element={<AlgorithmExplanationPage />}
            />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
