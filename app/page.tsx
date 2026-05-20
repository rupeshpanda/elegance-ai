import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhatIShare from "@/components/WhatIShare";
import Perspectives from "@/components/Perspectives";
import DemoWork from "@/components/DemoWork";
import About from "@/components/About";
import AIEdge from "@/components/AIEdge";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhatIShare />
        <Perspectives />
        <DemoWork />
        <About />
        <AIEdge />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
