import Hero from "@/components/Hero";
import Toolkit from "@/components/Toolkit";
import { toolkitItems } from "@/components/data/toolkit-data";
import GitHubActivity from "@/components/GitHubActivity";
import Projects from "@/components/Projects";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const App = () => {
  return (
    <main className="my-5">
      <Hero />
      <Toolkit items={toolkitItems} />
      <GitHubActivity />
      <Projects />
      <CallToAction />
      <Footer />
    </main>
  );
};

export default App;
