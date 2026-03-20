import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App.tsx';
import { AuthProvider } from '@/modules/auth/context/AuthContext.tsx';
import { SavedCampaignsProvider } from '@/modules/campaigns/context/SavedCampaignsContext.tsx';
import { MyCampaignsProvider } from '@/modules/campaigns/context/MyCampaignsContext.tsx';
import { CampaignTabProvider } from '@/modules/campaigns/context/CampaignTabContext.tsx';
import { loadCountries } from '@/shared/data/countries-loader';
import '../index.css';

void loadCountries().catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SavedCampaignsProvider>
        <MyCampaignsProvider>
          <CampaignTabProvider>
            <App />
          </CampaignTabProvider>
        </MyCampaignsProvider>
      </SavedCampaignsProvider>
    </AuthProvider>
  </StrictMode>
);
