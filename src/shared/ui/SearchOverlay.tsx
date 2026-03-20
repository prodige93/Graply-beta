import { useRef, useEffect, useState } from 'react';
import { Search, X, Building2, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfileSearch } from '@/shared/lib/use-search';
import { enterprises } from '@/modules/campaigns/data/mock-campaign-catalog';
import GrapeLoader from './GrapeLoader';
import { pathTo } from '@/app/routes';
const verifiedCreatorIcon = '/bcreateur.png';
const verifiedEnterpriseIcon = '/jentreprise.png';

const RECENT_SEARCHES_KEY = 'desktop_recent_searches';
const MAX_RECENT = 8;

interface RecentSearchItem {
  id: string;
  type: 'profile' | 'creator' | 'enterprise';
  username?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
}

function getRecentSearches(): RecentSearchItem[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(item: RecentSearchItem) {
  const existing = getRecentSearches().filter((r) => r.id !== item.id);
  const updated = [item, ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function removeRecentSearch(id: string) {
  const updated = getRecentSearches().filter((r) => r.id !== id);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

const sidebarCreators = [
  { id: 'c1', username: 'maxcreates', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', verified: true, bio: 'Content creator lifestyle & tech', categories: ['Tech', 'Lifestyle'] },
  { id: 'c2', username: 'sarahvibes', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', verified: false, bio: 'Mode et beauté, 3 ans UGC', categories: ['Mode', 'Beauté'] },
  { id: 'c3', username: 'techwithleo', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200', verified: true, bio: 'Tech reviewer & unboxer', categories: ['Tech', 'Gaming'] },
];

interface DbProfile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  display_name?: string;
}

interface SearchOverlayProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onClose: () => void;
  onSelectCreator?: (id: string) => void;
  onSelectProfile?: (profile: DbProfile) => void;
}

export default function SearchOverlay({ searchQuery, setSearchQuery, onClose, onSelectCreator, onSelectProfile }: SearchOverlayProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { results: dbProfiles, loading: searchLoading } = useProfileSearch(searchQuery);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const filteredCreators = sidebarCreators.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.username.toLowerCase().includes(q) || c.bio.toLowerCase().includes(q) || c.categories.some((cat) => cat.toLowerCase().includes(q));
  });

  const filteredEnterprises = searchQuery.trim()
    ? enterprises.filter((e) => {
        const q = searchQuery.toLowerCase();
        return e.name.toLowerCase().includes(q) || e.categories.some((c) => c.toLowerCase().includes(q));
      })
    : [];

  const hasResults = filteredCreators.length > 0 || filteredEnterprises.length > 0 || dbProfiles.length > 0;

  return (
    <div
      className="fixed inset-0 z-[200] hidden lg:flex flex-col"
      style={{
        background: 'rgba(5,4,4,0.65)',
        backdropFilter: 'blur(60px) saturate(180%)',
        WebkitBackdropFilter: 'blur(60px) saturate(180%)',
        animation: 'fadeInSearchFull 0.22s ease-out',
      }}
    >
      <style>{`@keyframes fadeInSearchFull { from { opacity:0; } to { opacity:1; } }`}</style>

      <div className="flex-1 flex flex-col overflow-y-auto px-6 pb-6 pt-2">
        <div className="max-w-3xl w-full mx-auto" style={{maxWidth:'780px'}}>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center gap-3 rounded-2xl px-5 py-3 flex-1"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <Search className="w-5 h-5 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un créateur, une entreprise..."
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
              />
              {searchQuery.length > 0 && (
                <button onClick={() => setSearchQuery('')} className="shrink-0">
                  <X className="w-4 h-4 text-white/40 hover:text-white/70 transition-colors" />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105 active:scale-90 shrink-0"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {!searchQuery.trim() && recentSearches.length > 0 && (
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-white">Recent</span>
              <button
                onClick={() => { clearRecentSearches(); setRecentSearches([]); }}
                className="text-xs font-semibold text-white/50 hover:text-white transition-colors"
              >
                Tout effacer
              </button>
            </div>
          )}

          {!searchQuery.trim() && recentSearches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Search className="w-10 h-10 text-white/10 mb-4" />
              <p className="text-sm text-white/25">Aucune recherche récente</p>
            </div>
          ) : !searchQuery.trim() && recentSearches.length > 0 ? (
            <div className="space-y-0.5">
              {recentSearches.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer group"
                  onClick={() => {
                    if (item.type === 'profile') navigate(pathTo.userProfile(item.username!));
                    else if (item.type === 'creator') navigate(pathTo.createur(item.id));
                    else if (item.type === 'enterprise') navigate(pathTo.entreprise(item.id));
                    onClose();
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                    style={!item.avatar ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : undefined}
                  >
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.username || item.name} className="w-full h-full object-cover" style={{ borderRadius: item.type === 'enterprise' ? '10px' : '50%' }} />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-white truncate">
                        {item.type === 'profile' ? `@${item.username}` : (item.name || item.username)}
                      </span>
                      {item.verified && <img src={item.type === 'enterprise' ? verifiedEnterpriseIcon : verifiedCreatorIcon} alt="" className="w-5 h-5 shrink-0" />}
                    </div>
                    {item.bio && <p className="text-xs text-white/40 truncate">{item.bio}</p>}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(item.id);
                      setRecentSearches(getRecentSearches());
                    }}
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <X className="w-3.5 h-3.5 text-white/50" />
                  </button>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() && searchLoading ? (
            <div className="flex items-center justify-center py-32">
              <GrapeLoader size="md" />
            </div>
          ) : searchQuery.trim() && !hasResults ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Search className="w-10 h-10 text-white/10 mb-4" />
              <p className="text-base text-white/25">Aucun résultat pour "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredEnterprises.length > 0 && (
                <>
                  {searchQuery.trim() && (
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 pt-1 pb-2">Entreprises</p>
                  )}
                  {filteredEnterprises.map((ent) => (
                    <div
                      key={ent.id}
                      onClick={() => {
                        saveRecentSearch({ id: ent.id, type: 'enterprise', name: ent.name, avatar: ent.logo, verified: ent.verified, bio: ent.description });
                        onClose();
                        navigate(pathTo.entreprise(ent.id), { state: { from: location.pathname, backState: { searchOpen: true, searchQuery } } });
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <img src={ent.logo} alt={ent.name} className="w-11 h-11 rounded-xl object-cover shrink-0" style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-white truncate">{ent.name}</span>
                          {ent.verified && <img src={verifiedEnterpriseIcon} alt="" className="w-5 h-5 shrink-0" />}
                        </div>
                        <p className="text-xs text-white/40 truncate">{ent.description}</p>
                      </div>
                      <Building2 className="w-4 h-4 text-white/20 shrink-0" />
                    </div>
                  ))}
                </>
              )}

              {dbProfiles.length > 0 && searchQuery.trim() && (
                <>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 pt-3 pb-2">Membres</p>
                  {dbProfiles.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        saveRecentSearch({ id: p.id, type: 'profile', username: p.username, avatar: p.avatar_url, bio: p.bio || p.display_name });
                        if (onSelectProfile) { onSelectProfile(p); }
                        else { navigate(pathTo.userProfile(p.username), { state: { from: location.pathname, backState: { searchOpen: true, searchQuery } } }); }
                        onClose();
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <div
                        className="w-11 h-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                        style={!p.avatar_url ? { background: 'linear-gradient(135deg, #f97316, #ec4899)' } : undefined}
                      >
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt={p.username} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-white truncate block">@{p.username}</span>
                        <p className="text-xs text-white/40 truncate">{p.bio || p.display_name}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {filteredCreators.length > 0 && (
                <>
                  {searchQuery.trim() && (
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 pt-3 pb-2">Créateurs</p>
                  )}
                  {filteredCreators.map((creator) => (
                    <div
                      key={creator.id}
                      onClick={() => {
                        saveRecentSearch({ id: creator.id, type: 'creator', username: creator.username, avatar: creator.avatar, bio: creator.bio, verified: creator.verified });
                        if (onSelectCreator) { onSelectCreator(creator.id); }
                        else { navigate(pathTo.createur(creator.id), { state: { from: location.pathname, backState: { searchOpen: true, searchQuery } } }); }
                        onClose();
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <img src={creator.avatar} alt={creator.username} className="w-11 h-11 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-white truncate">{creator.username}</span>
                          {creator.verified && <img src={verifiedCreatorIcon} alt="" className="w-5 h-5 shrink-0" />}
                        </div>
                        <p className="text-xs text-white/40 truncate">{creator.bio}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
