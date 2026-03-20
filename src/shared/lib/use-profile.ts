import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  banner_url: string | null;
  is_public: boolean;
  website: string;
  content_tags: string[];
  content_type: string[];
  messaging_enabled: boolean;
  hidden_stats: string[];
  hidden_campaigns: string[];
  instagram_handle: string;
  tiktok_handle: string;
  youtube_handle: string;
}

let cachedProfile: Profile | null = null;
let cachedUserId: string | null = null;
let fetchPromise: Promise<Profile | null> | null = null;
const listeners = new Set<(p: Profile | null) => void>();

function notifyListeners(p: Profile | null) {
  listeners.forEach((fn) => fn(p));
}

async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

async function loadProfile(): Promise<Profile | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  cachedUserId = userId;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  cachedProfile = data;
  return data;
}

export function prefetchProfile() {
  if (!fetchPromise) {
    fetchPromise = loadProfile();
  }
  return fetchPromise;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(cachedProfile);

  useEffect(() => {
    const handler = (p: Profile | null) => setProfile(p);
    listeners.add(handler);

    if (cachedProfile) {
      setProfile(cachedProfile);
    }

    if (!fetchPromise) {
      fetchPromise = loadProfile();
    }
    fetchPromise.then((data) => {
      if (data) setProfile(data);
    });

    return () => { listeners.delete(handler); };
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    cachedProfile = cachedProfile ? { ...cachedProfile, ...updates } : null;
    notifyListeners(cachedProfile);
  }, []);

  const refetch = useCallback(async () => {
    fetchPromise = null;
    cachedProfile = null;
    fetchPromise = loadProfile();
    const data = await fetchPromise;
    notifyListeners(data);
  }, []);

  return { profile, updateProfile, refetch };
}

export function getProfileUserId(): string | null {
  return cachedUserId;
}
