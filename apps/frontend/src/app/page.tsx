import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { SecuritySection } from "@/components/landing/security-section";
import { QRPaymentSection } from "@/components/landing/qr-payment-section";
import { DeviceCompatibility } from "@/components/landing/device-compatibility";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing";
import { DeveloperSection } from "@/components/landing/developer-section";
import { FAQSection } from "@/components/landing/faq-section";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-veyra-dark overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SecuritySection />
      <QRPaymentSection />
      <DeviceCompatibility />
      <TestimonialsSection />
      <PricingSection />
      <DeveloperSection />
      <FAQSection />
      <LandingFooter />
    </main>
  );
}
