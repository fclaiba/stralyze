import Header from "@/components/header"
import HeroWithCanvasReveal from "@/components/hero-with-canvas-reveal"
import FeatureSection from "@/components/feature-section"
import CompanyPresentation from "@/components/company-presentation"
import ServicesSection from "@/components/services-section"
import CaseStudies from "@/components/case-studies"
import TestimonialsSection from "@/components/testimonials-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"
import CommonBackground from "@/components/common-background"

// Import the new input component
import "@/components/ui/new-input"

export default function Home() {
  return (
    <main className="relative bg-transparent">
      <CommonBackground />
      <Header />
      <HeroWithCanvasReveal />
      <FeatureSection />
      <CompanyPresentation />
      <ServicesSection />
      <CaseStudies />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
