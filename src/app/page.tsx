import { Header } from "@/components/Header";
import { Embed } from "@/components/sections/Embed";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Integrations } from "@/components/sections/Integrations";
import { Platform } from "@/components/sections/Platform";
import { Problem } from "@/components/sections/Problem";
import { Proof } from "@/components/sections/Proof";
import { Orbit } from "@/components/sections/Orbit";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <Problem />
        <Platform />
        <Embed />
        <Orbit />
        <Integrations />
        <Proof />
      </main>
      <Footer />
    </>
  );
}
