import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Impact from "@/app/components/Impact";
import Experience from "@/app/components/Experience";
import Projects from "@/app/components/Projects";
// import ArchitectureDiagrams from "@/app/components/ArchitectureDiagrams";
import TechStack from "@/app/components/TechStack";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";
import ScrollDepthTracker from "@/app/components/ScrollDepthTracker";

export default function Home() {
  return (
    <>
      <ScrollDepthTracker page="home" />
      <Header />
      <main className="flex flex-col">
        <Hero />
        <About />
        <Impact />
        <Experience />
        <Projects />
        {/* <ArchitectureDiagrams /> */}
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
