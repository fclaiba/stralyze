import { Suspense, lazy } from "react"
import Header from "@/components/header"
import HeroWithCanvasReveal from "@/components/hero-with-canvas-reveal"
import CommonBackground from "@/components/common-background"

// Lazy load components for better performance
const FeatureSection = lazy(() => import("@/components/feature-section"))
const CompanyPresentation = lazy(() => import("@/components/company-presentation"))
const ServicesSection = lazy(() => import("@/components/services-section"))
const CaseStudies = lazy(() => import("@/components/case-studies"))
const TestimonialsSection = lazy(() => import("@/components/testimonials-section"))
const CTASection = lazy(() => import("@/components/cta-section"))
const Footer = lazy(() => import("@/components/footer"))

// Loading components
const SectionLoader = () => (
  <div className="relative py-24 overflow-hidden">
    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700/30 p-6 rounded-lg">
              <div className="h-6 bg-gray-600 rounded mb-4"></div>
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Import the new input component
import "@/components/ui/new-input"

export default function Home() {
  return (
    <main className="relative bg-transparent">
      <CommonBackground />
      <Header />
      <HeroWithCanvasReveal />
      
      <Suspense fallback={<SectionLoader />}>
        <FeatureSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CompanyPresentation />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <ServicesSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CaseStudies />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CTASection />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 bg-gray-900 animate-pulse"></div>}>
        <Footer />
      </Suspense>
    </main>
  )
}
