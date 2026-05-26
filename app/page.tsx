import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhatIShare from "@/components/WhatIShare";
import Perspectives from "@/components/Perspectives";
import DemoWork from "@/components/DemoWork";
import About from "@/components/About";
import AIEdge from "@/components/AIEdge";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getSite, getHero, getWhatIShare, getPerspectivesSection,
  getWorkSection, getAbout, getAiEdge, getContact,
  getPerspectives, getWork,
} from "@/lib/reader";

export default async function Home() {
  const [
    site, hero, whatIShare, perspectivesSection,
    workSection, about, aiEdge, contact,
    articles, projects,
  ] = await Promise.all([
    getSite(), getHero(), getWhatIShare(), getPerspectivesSection(),
    getWorkSection(), getAbout(), getAiEdge(), getContact(),
    getPerspectives(), getWork(),
  ]);

  return (
    <>
      <Nav site={site} />
      <main>
        <Hero data={hero} />
        <WhatIShare data={whatIShare} />
        <Perspectives section={perspectivesSection} articles={articles} />
        <DemoWork section={workSection} projects={projects} />
        <About data={about} />
        <AIEdge data={aiEdge} />
        <Contact data={contact} />
      </main>
      <Footer site={site} />
    </>
  );
}
