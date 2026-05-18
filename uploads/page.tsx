import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/sections/about/Hero";
import WhatIsShekel from "@/components/sections/about/WhatIsShekel";
import ProblemSolution from "@/components/sections/about/ProblemSolution";
import Differentiation from "@/components/sections/about/Differentiation";
import WhatYouCanDo from "@/components/sections/about/WhatYouCanDo";
import HowItWorks from "@/components/sections/about/HowItWorks";
import CorePrinciples from "@/components/sections/about/CorePrinciples";
import Cta from "@/components/sections/about/Cta";

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-clip text-white selection:bg-blue-500/30">
      <Header />
      <main className="pt-[75px]">
        <Hero />
        <WhatIsShekel />
        <ProblemSolution />
        <Differentiation />
        <WhatYouCanDo />
        <HowItWorks />
        <CorePrinciples />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
