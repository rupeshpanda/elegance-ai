import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AffiliationBar from "@/components/AffiliationBar";
import WhatIShare from "@/components/WhatIShare";
import HowIEngage from "@/components/HowIEngage";
import Perspectives from "@/components/Perspectives";
import TestimonialStrip from "@/components/TestimonialStrip";
import DemoWork from "@/components/DemoWork";
import About from "@/components/About";
import AIEdge from "@/components/AIEdge";
import AccordionFAQ from "@/components/AccordionFAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getHero, getWhatIShare, getPerspectivesSection,
  getAbout, getAiEdge, getContact,
  getPerspectives, getWork,
} from "@/lib/reader";

export default async function Home() {
  const [
    hero, whatIShare, perspectivesSection,
    about, aiEdge, contact,
    articles, projects,
  ] = await Promise.all([
    getHero(), getWhatIShare(), getPerspectivesSection(),
    getAbout(), getAiEdge(), getContact(),
    getPerspectives(), getWork(),
  ]);

  return (
    <>
      <Nav />
      <main>
        <Hero data={hero} />
        <hr className="section-divider" />
        <AffiliationBar />
        <hr className="section-divider" />
        <WhatIShare data={whatIShare} />
        <hr className="section-divider" />
        <HowIEngage />
        <hr className="section-divider" />
        <Perspectives section={perspectivesSection} articles={articles} />
        <hr className="section-divider" />
        <TestimonialStrip />
        <hr className="section-divider" />
        <DemoWork projects={projects} />
        <hr className="section-divider" />
        <About data={about} />
        <hr className="section-divider" />
        <AIEdge data={aiEdge} />
        <hr className="section-divider" />
        <AccordionFAQ />
        <hr className="section-divider" />
        <Contact data={contact} />
      </main>
      <Footer />
    </>
  );
}
