import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero";
import { Footer } from "./_components/footer";
import FAQ from "./_components/faq";

export const metadata = {
  title: "Free Tree Testing Tool",
  description:
    "Create, conduct, and analyze tree tests for free. Optimize your information architecture with valuable insights.",
};

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <FAQ />
      <Footer />
    </main>
  );
}
