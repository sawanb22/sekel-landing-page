import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Hero from "@/components/sections/agent-detail/Hero";
import TryThisAgent from "@/components/sections/agent-detail/TryThisAgent";
import ProvenResults from "@/components/sections/agent-detail/ProvenResults";
import HowItWorks from "@/components/sections/agent-detail/HowItWorks";
import DesignedFor from "@/components/sections/agent-detail/DesignedFor";
import PricingOptions from "@/components/sections/agent-detail/PricingOptions";
import UserReviews from "@/components/sections/agent-detail/UserReviews";
import SimilarAgents from "@/components/sections/agent-detail/SimilarAgents";
import CtaAgent from "@/components/sections/agent-detail/CtaAgent";

export default function AgentDetailPage() {
  return (
    <div className="min-h-screen overflow-x-clip text-white selection:bg-blue-500/30">
      <Header />
      <main className="pt-[75px] flex flex-col gap-12 md:gap-24 pb-24">
        <Hero />
        <TryThisAgent />
        <ProvenResults />
        <HowItWorks />
        <DesignedFor />
        <PricingOptions />
        <UserReviews />
        <SimilarAgents />
        <CtaAgent />
      </main>
      <Footer />
    </div>
  );
}
