import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { HeroConsole } from "@/components/home/HeroConsole";
import { FormulaSection } from "@/components/home/FormulaSection";
import { SessionsSection } from "@/components/home/SessionsSection";
import { VenueBento } from "@/components/home/VenueBento";
import { DiptychSection } from "@/components/home/DiptychSection";
import { ChainSpec } from "@/components/home/ChainSpec";
import { TransparencyLedger } from "@/components/home/TransparencyLedger";
import { FaqSection } from "@/components/home/FaqSection";
import { ClosingSection } from "@/components/home/ClosingSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroConsole />
        <FormulaSection />
        <SessionsSection />
        <VenueBento />
        <DiptychSection />
        <ChainSpec />
        <TransparencyLedger />
        <FaqSection />
        <ClosingSection />
      </main>
      <Footer />
    </div>
  );
}
