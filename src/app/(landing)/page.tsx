import { Header } from "./_sections/header";
import { HeroSection } from "./_sections/hero";
import { Footer } from "./_sections/footer";
import FAQ from "./_sections/faq";

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
