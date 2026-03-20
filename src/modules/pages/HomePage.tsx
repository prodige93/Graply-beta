import { useState, useCallback } from 'react';
import Navbar from '@/shared/ui/Navbar';
import EarthShowcase from '@/shared/ui/EarthShowcase';
import Hero from '@/shared/ui/Hero';
import HowItWorks from '@/shared/ui/HowItWorks';
import PopularCampaigns from '@/modules/campaigns/ui/PopularCampaigns';
import CampaignSteps from '@/modules/campaigns/ui/CampaignSteps';
import FAQ from '@/shared/ui/FAQ';
import RaisinVideo from '@/shared/ui/RaisinVideo';
import ErrorBoundary from '@/shared/ui/ErrorBoundary';
import HelpSidebar from '@/shared/ui/HelpSidebar';
import Footer from '@/shared/ui/Footer';

interface HomePageProps {
  onAuthClick: (role: 'creator' | 'enterprise' | 'login') => void;
}

export default function HomePage({ onAuthClick }: HomePageProps) {
  const [isMars, setIsMars] = useState(false);
  const handleToggle = useCallback(() => setIsMars((prev) => !prev), []);

  return (
    <div className="bg-black min-h-screen">
      <Navbar isMars={isMars} onAuthClick={onAuthClick} />
      <ErrorBoundary>
        <Hero isMars={isMars} onToggle={handleToggle} onAuthClick={onAuthClick} />
      </ErrorBoundary>
      <HowItWorks isMars={isMars} />
      <PopularCampaigns isMars={isMars} />
      <ErrorBoundary>
        <EarthShowcase isMars={isMars} />
      </ErrorBoundary>
      <CampaignSteps isMars={isMars} />
      <FAQ isMars={isMars} />
      <ErrorBoundary>
        <RaisinVideo isMars={isMars} />
      </ErrorBoundary>
      <Footer isMars={isMars} />
      <HelpSidebar isMars={isMars} />
    </div>
  );
}
