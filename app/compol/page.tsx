import Header from "@/components/header"
import HeroWithCanvasRevealPolitical from "@/components/political/hero-with-canvas-reveal-political"
import PoliticalFeatureSection from "@/components/political/political-feature-section"
import PoliticalPresentation from "@/components/political/political-presentation"
import PoliticalServicesSection from "@/components/political/political-services-section"
import PoliticalCaseStudies from "@/components/political/political-case-studies"
import PoliticalTestimonialsSection from "@/components/political/political-testimonials-section"
import PoliticalCTASection from "@/components/political/political-cta-section"
import Footer from "@/components/footer"
import CommonBackground from "@/components/common-background"
import PasswordProtection from "@/components/password-protection"

export default function PoliticalCommunicationPage() {
  return (
    <PasswordProtection requiredPassword="buenacampaña" routePath="/compol">
      <main className="relative bg-transparent">
        <CommonBackground />
        <Header />
        <HeroWithCanvasRevealPolitical />
        <PoliticalFeatureSection />
        <PoliticalPresentation />
        <PoliticalServicesSection />
        <PoliticalCaseStudies />
        <PoliticalTestimonialsSection />
        <PoliticalCTASection />
        <Footer />
      </main>
    </PasswordProtection>
  )
}
