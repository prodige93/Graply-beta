import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/shared/lib/supabase';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  photo_url: string | null;
  budget: string;
  content_type: string;
  categories: string[];
  platforms: string[];
  platform_budgets: Record<string, { amount: string; per1000: string; min: string; max: string }>;
  status: string;
  created_at: string;
}

interface MyCampaignsContextValue {
  campaigns: Campaign[];
  pausedCampaigns: Campaign[];
  drafts: Campaign[];
  loading: boolean;
  refresh: () => void;
  deleteDraft: (id: string) => void;
  updateCampaignStatus: (id: string, status: string) => void;
}

const MyCampaignsContext = createContext<MyCampaignsContextValue | null>(null);

export function MyCampaignsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pausedCampaigns, setPausedCampaigns] = useState<Campaign[]>([]);
  const [drafts, setDrafts] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const [pubResult, pausedResult, draftResult] = await Promise.all([
      supabase.from('campaigns').select('*').eq('status', 'published').order('created_at', { ascending: false }),
      supabase.from('campaigns').select('*').eq('status', 'paused').order('created_at', { ascending: false }),
      supabase.from('campaigns').select('*').eq('status', 'draft').order('created_at', { ascending: false }),
    ]);
    setCampaigns(pubResult.data ?? []);
    setPausedCampaigns(pausedResult.data ?? []);
    if (draftResult.data) setDrafts(draftResult.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const deleteDraft = useCallback((id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateCampaignStatus = useCallback((id: string, status: string) => {
    if (status === 'published') {
      setPausedCampaigns((prev) => {
        const found = prev.find((c) => c.id === id);
        if (found) {
          setCampaigns((cur) => [{ ...found, status: 'published' }, ...cur]);
          return prev.filter((c) => c.id !== id);
        }
        return prev;
      });
    } else if (status === 'paused') {
      setCampaigns((prev) => {
        const found = prev.find((c) => c.id === id);
        if (found) {
          setPausedCampaigns((cur) => [{ ...found, status: 'paused' }, ...cur]);
          return prev.filter((c) => c.id !== id);
        }
        return prev;
      });
    }
  }, []);

  return (
    <MyCampaignsContext.Provider value={{ campaigns, pausedCampaigns, drafts, loading, refresh: fetchCampaigns, deleteDraft, updateCampaignStatus }}>
      {children}
    </MyCampaignsContext.Provider>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components -- hook exporté avec le provider */
export function useMyCampaigns() {
  const ctx = useContext(MyCampaignsContext);
  if (!ctx) throw new Error('useMyCampaigns must be used within MyCampaignsProvider');
  return ctx;
}
