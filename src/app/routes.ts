/**
 * Routage centralisé : chemins statiques, patterns (:param) et builders.
 * Utiliser ces constantes partout à la place de chaînes en dur.
 */

/** Chemins sans paramètres dynamiques */
export const ROUTES = {
  home: '/',
  auth: '/auth',
  campagnes: '/campagnes',
  creerCampagne: '/creer-campagne',
  mesCampagnes: '/mes-campagnes',
  validationVideos: '/validation-videos',
  mesVideos: '/mes-videos',
  dashboard: '/dashboard',
  notifications: '/notifications',
  messagerie: '/messagerie',
  rechercheCreateurs: '/recherche-createurs',
  profil: '/profil',
  monCompte: '/mon-compte',
  parametres: '/parametres',
  enregistre: '/enregistre',
  mesValidations: '/mes-validations',
} as const;

export type RouteStatic = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Patterns pour <Route path={...}> (inclut :id, :username)
 */
export const ROUTE_PATTERNS = {
  home: '/',
  auth: '/auth',
  campagnes: '/campagnes',
  campagne: '/campagne/:id',
  campagneVerification: '/campagne/:id/verification',
  creerCampagne: '/creer-campagne',
  modifierCampagne: '/modifier-campagne/:id',
  mesCampagnes: '/mes-campagnes',
  maCampagne: '/ma-campagne/:id',
  maCampagneVerifications: '/ma-campagne/:id/verifications',
  maCampagneValidationCreateurs: '/ma-campagne/:id/validation-createurs',
  validationVideos: '/validation-videos',
  mesVideos: '/mes-videos',
  dashboard: '/dashboard',
  notifications: '/notifications',
  messagerie: '/messagerie',
  rechercheCreateurs: '/recherche-createurs',
  profil: '/profil',
  entreprise: '/entreprise/:id',
  createur: '/createur/:id',
  userProfile: '/u/:username',
  monCompte: '/mon-compte',
  parametres: '/parametres',
  enregistre: '/enregistre',
  mesValidations: '/mes-validations',
} as const;

export type RoutePatternKey = keyof typeof ROUTE_PATTERNS;

/** Construction d’URL avec segments dynamiques */
export const pathTo = {
  campagne: (id: string) => `/campagne/${encodeURIComponent(id)}`,
  campagneVerification: (id: string) => `/campagne/${encodeURIComponent(id)}/verification`,
  modifierCampagne: (id: string) => `/modifier-campagne/${encodeURIComponent(id)}`,
  maCampagne: (id: string) => `/ma-campagne/${encodeURIComponent(id)}`,
  maCampagneVerifications: (id: string) => `/ma-campagne/${encodeURIComponent(id)}/verifications`,
  maCampagneValidationCreateurs: (id: string) =>
    `/ma-campagne/${encodeURIComponent(id)}/validation-createurs`,
  entreprise: (id: string) => `/entreprise/${encodeURIComponent(id)}`,
  createur: (id: string) => `/createur/${encodeURIComponent(id)}`,
  userProfile: (username: string) => `/u/${encodeURIComponent(username)}`,
} as const;

/** Messagerie avec fil DM (et query optionnelle ex. from=search) */
export function messagingWithDm(username: string, extra?: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  params.set('dm', username);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined) params.set(k, v);
    }
  }
  return `${ROUTES.messagerie}?${params.toString()}`;
}

/** Identifiant stable + libellé pour chaque page (navigation, analytics, debug) */
export const ROUTE_REGISTRY: ReadonlyArray<{
  id: string;
  label: string;
  pattern: string;
  staticPath?: RouteStatic;
}> = [
  { id: 'home', label: 'Accueil', pattern: ROUTE_PATTERNS.home, staticPath: ROUTES.home },
  { id: 'auth', label: 'Connexion / inscription', pattern: ROUTE_PATTERNS.auth, staticPath: ROUTES.auth },
  { id: 'campagnes', label: 'Catalogue campagnes', pattern: ROUTE_PATTERNS.campagnes, staticPath: ROUTES.campagnes },
  { id: 'campagne-detail', label: 'Détail campagne', pattern: ROUTE_PATTERNS.campagne },
  { id: 'campagne-verification', label: 'Vérification vidéo (campagne)', pattern: ROUTE_PATTERNS.campagneVerification },
  { id: 'creer-campagne', label: 'Créer une campagne', pattern: ROUTE_PATTERNS.creerCampagne, staticPath: ROUTES.creerCampagne },
  { id: 'modifier-campagne', label: 'Modifier campagne', pattern: ROUTE_PATTERNS.modifierCampagne },
  { id: 'mes-campagnes', label: 'Mes campagnes', pattern: ROUTE_PATTERNS.mesCampagnes, staticPath: ROUTES.mesCampagnes },
  { id: 'ma-campagne', label: 'Ma campagne (créateur)', pattern: ROUTE_PATTERNS.maCampagne },
  { id: 'ma-campagne-verifications', label: 'Vérifications créateurs', pattern: ROUTE_PATTERNS.maCampagneVerifications },
  { id: 'ma-campagne-validation', label: 'Validation accès créateurs', pattern: ROUTE_PATTERNS.maCampagneValidationCreateurs },
  { id: 'validation-videos', label: 'Validation vidéos', pattern: ROUTE_PATTERNS.validationVideos, staticPath: ROUTES.validationVideos },
  { id: 'mes-videos', label: 'Mes vidéos', pattern: ROUTE_PATTERNS.mesVideos, staticPath: ROUTES.mesVideos },
  { id: 'dashboard', label: 'Dashboard créateur', pattern: ROUTE_PATTERNS.dashboard, staticPath: ROUTES.dashboard },
  { id: 'notifications', label: 'Notifications', pattern: ROUTE_PATTERNS.notifications, staticPath: ROUTES.notifications },
  { id: 'messagerie', label: 'Messagerie', pattern: ROUTE_PATTERNS.messagerie, staticPath: ROUTES.messagerie },
  { id: 'recherche-createurs', label: 'Recherche créateurs', pattern: ROUTE_PATTERNS.rechercheCreateurs, staticPath: ROUTES.rechercheCreateurs },
  { id: 'profil', label: 'Profil', pattern: ROUTE_PATTERNS.profil, staticPath: ROUTES.profil },
  { id: 'entreprise', label: 'Fiche entreprise', pattern: ROUTE_PATTERNS.entreprise },
  { id: 'createur', label: 'Fiche créateur', pattern: ROUTE_PATTERNS.createur },
  { id: 'user-public', label: 'Profil public (@)', pattern: ROUTE_PATTERNS.userProfile },
  { id: 'mon-compte', label: 'Mon compte', pattern: ROUTE_PATTERNS.monCompte, staticPath: ROUTES.monCompte },
  { id: 'parametres', label: 'Paramètres', pattern: ROUTE_PATTERNS.parametres, staticPath: ROUTES.parametres },
  { id: 'enregistre', label: 'Campagnes enregistrées', pattern: ROUTE_PATTERNS.enregistre, staticPath: ROUTES.enregistre },
  { id: 'mes-validations', label: 'Mes validations', pattern: ROUTE_PATTERNS.mesValidations, staticPath: ROUTES.mesValidations },
];

/** Libellé lisible à partir du pathname courant (approximation pour routes dynamiques) */
export function describePathname(pathname: string): string {
  const exact = ROUTE_REGISTRY.find((r) => r.staticPath === pathname);
  if (exact) return exact.label;
  if (pathname.startsWith('/campagne/') && pathname.endsWith('/verification')) return 'Vérification vidéo (campagne)';
  if (pathname.startsWith('/campagne/')) return 'Détail campagne';
  if (pathname.startsWith('/modifier-campagne/')) return 'Modifier campagne';
  if (pathname.startsWith('/ma-campagne/') && pathname.includes('/verifications')) return 'Vérifications créateurs';
  if (pathname.startsWith('/ma-campagne/') && pathname.includes('/validation-createurs')) return 'Validation accès créateurs';
  if (pathname.startsWith('/ma-campagne/')) return 'Ma campagne';
  if (pathname.startsWith('/entreprise/')) return 'Fiche entreprise';
  if (pathname.startsWith('/createur/')) return 'Fiche créateur';
  if (pathname.startsWith('/u/')) return 'Profil public';
  if (pathname.startsWith(ROUTES.messagerie)) return 'Messagerie';
  return pathname || 'Inconnu';
}
