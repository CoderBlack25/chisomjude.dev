import Hero from "@/components/Hero";
import Toolkit from "@/components/Toolkit";
import { toolkitItems } from "@/components/data/toolkit-data";
import GitHubActivity from "@/components/GitHubActivity";
import Projects from "@/components/Projects";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const App = () => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-(--accent) focus:px-4 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-black focus:outline-none focus:ring-2 focus:ring-(--text-h)"
      >
        Skip to main content
      </a>

      <main id="main-content" tabIndex={-1} className="my-5 outline-none">
        <Hero />
        <Toolkit items={toolkitItems} />
        <GitHubActivity />
        <Projects />
        <CallToAction />
      </main>

      <Footer />
    </>
  );
};

export default App;
