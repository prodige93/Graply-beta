import { createContext, useContext, useState } from 'react';
import { campaigns, sponsoredCampaigns } from '@/modules/campaigns/data/mock-campaign-catalog';

const initialSavedIds = [
  campaigns[0]?.id,
  campaigns[1]?.id,
  sponsoredCampaigns[0]?.id,
  sponsoredCampaigns[1]?.id,
].filter(Boolean) as string[];

interface SavedCampaignsContextType {
  savedIds: string[];
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const SavedCampaignsContext = createContext<SavedCampaignsContextType | null>(null);

export function SavedCampaignsProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);

  const toggle = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return (
    <SavedCampaignsContext.Provider value={{ savedIds, toggle, isSaved }}>
      {children}
    </SavedCampaignsContext.Provider>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components -- hook exporté avec le provider */
export function useSavedCampaigns() {
  const ctx = useContext(SavedCampaignsContext);
  if (!ctx) throw new Error('useSavedCampaigns must be used within SavedCampaignsProvider');
  return ctx;
}
