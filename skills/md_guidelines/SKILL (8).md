# SKILL — DESIGNER UI/UX SENIOR (Frontend Design Professionnel)
## Rôle : Design system · Composants · Accessibilité · Interface métier

---

## QUI TU ES DANS CETTE SESSION

Tu es un **designer UI/UX senior** doublé d'un développeur frontend. Tu construis des
interfaces qui respectent un design system cohérent, qui sont accessibles, et qui
correspondent au contexte métier (application d'entreprise, pas une startup tech).
L'interface doit inspirer la confiance et la rigueur — pas la fantaisie.

---

## DESIGN SYSTEM — TOKENS ET VARIABLES

### Palette de couleurs

```css
/* tailwind.config.ts — étendre avec ces couleurs métier */
:root {
  /* Couleurs principales */
  --bleu-primaire: #1D4ED8;       /* Actions principales, liens */
  --bleu-survol:   #1E40AF;       /* Hover des actions principales */
  --bleu-leger:    #EFF6FF;       /* Arrière-plan des infos */

  /* Statuts dossiers */
  --statut-nouveau:          #DBEAFE; /* Bleu clair */
  --statut-instruction:      #FEF3C7; /* Jaune clair */
  --statut-attente-client:   #FED7AA; /* Orange clair */
  --statut-attente-valid:    #EDE9FE; /* Violet clair */
  --statut-valide:           #D1FAE5; /* Vert clair */
  --statut-rejete:           #FEE2E2; /* Rouge clair */
  --statut-archive:          #F3F4F6; /* Gris clair */

  /* Sémantique */
  --couleur-succes:    #059669;
  --couleur-erreur:    #DC2626;
  --couleur-avert:     #D97706;
  --couleur-info:      #2563EB;

  /* Priorités */
  --priorite-normale:  #6B7280;
  --priorite-urgente:  #DC2626;
}
```

### Typographie

```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],  // Pour numéros de dossiers
}
```

---

## LAYOUT PRINCIPAL — APPSHELL

```typescript
// components/layout/AppShell.tsx
export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar fixe à gauche */}
      <Sidebar />

      {/* Zone principale */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar />

        {/* Contenu de la page */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
```

```typescript
// components/layout/Sidebar.tsx
const NAVIGATION = [
  {
    label: 'Dossiers',
    icon: FolderOpen,
    href: '/dossiers',
    roles: ['terrain', 'bureau', 'superviseur', 'admin'],
  },
  {
    label: 'Tableau de bord',
    icon: BarChart3,
    href: '/dashboard',
    roles: ['superviseur', 'admin'],
  },
  {
    label: 'Rapports',
    icon: FileText,
    href: '/rapports',
    roles: ['superviseur', 'admin'],
  },
  {
    label: 'Administration',
    icon: Settings,
    href: '/admin/utilisateurs',
    roles: ['admin'],
  },
];

export function Sidebar() {
  const { utilisateur } = useAuthStore();
  const location = useLocation();

  // Filtrer les liens selon le rôle
  const liensVisibles = NAVIGATION.filter(lien =>
    lien.roles.includes(utilisateur?.role ?? ''),
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-gray-900 text-sm">Archivage Électricité</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {liensVisibles.map((lien) => {
          const actif = location.pathname.startsWith(lien.href);
          return (
            <Link
              key={lien.href}
              to={lien.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                actif
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <lien.icon className={cn('h-5 w-5', actif ? 'text-blue-600' : 'text-gray-400')} />
              {lien.label}
            </Link>
          );
        })}
      </nav>

      {/* Utilisateur connecté */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 text-sm font-semibold">
              {utilisateur?.prenom?.[0]}{utilisateur?.nom?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {utilisateur?.prenom} {utilisateur?.nom}
            </p>
            <p className="text-xs text-gray-500 capitalize">{utilisateur?.role}</p>
          </div>
          <button onClick={deconnecter} className="text-gray-400 hover:text-gray-600">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
```

---

## PAGE D'EN-TÊTE — PATTERN UNIFORME

```typescript
// Chaque page commence par ce pattern d'en-tête
interface PageHeaderProps {
  titre: string;
  description?: string;
  action?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    roles?: Role[];
  };
  retour?: string;
}

export function PageHeader({ titre, description, action, retour }: PageHeaderProps) {
  const navigate = useNavigate();
  const { utilisateur } = useAuthStore();

  const actionVisible = !action?.roles || action.roles.includes(utilisateur?.role ?? '');

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {retour && (
          <button
            onClick={() => navigate(retour)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{titre}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {action && actionVisible && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </button>
      )}
    </div>
  );
}
```

---

## VUE DÉTAIL DOSSIER — LAYOUT COMPLET

```typescript
// pages/dossiers/DossierDetailPage.tsx
export function DossierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: dossier, isLoading } = useDossier(id!);

  if (isLoading) return <LoadingSpinner />;
  if (!dossier) return <NotFoundState />;

  return (
    <div>
      <PageHeader
        titre={`Dossier ${dossier.numero}`}
        description={dossier.nomClient}
        retour="/dossiers"
      />

      {/* Bandeau de statut coloré */}
      <StatutBandeau dossier={dossier} />

      {/* Grille 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* Colonne principale (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <InformationsCard dossier={dossier} />
          <DocumentsSection dossierId={dossier.id} />
          <NotesSection dossierId={dossier.id} />
        </div>

        {/* Colonne latérale (1/3) */}
        <div className="space-y-6">
          <ActionsCard dossier={dossier} />
          <TimelineCard dossierId={dossier.id} />
        </div>

      </div>
    </div>
  );
}
```

---

## COMPOSANTS SPÉCIFIQUES AU MÉTIER

### Timeline d'historique

```typescript
// components/dossiers/DossierTimeline.tsx
export function DossierTimeline({ historique }: { historique: HistoriqueStatut[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Historique</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-gray-200 space-y-6">
          {historique.map((entree, index) => (
            <li key={entree.id} className="ml-4">
              {/* Point sur la ligne */}
              <div className={cn(
                'absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white',
                index === 0 ? 'bg-blue-600' : 'bg-gray-300',
              )} />

              {/* Contenu */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {entree.statutAvant && (
                    <>
                      <DossierBadgeStatut statut={entree.statutAvant} size="sm" />
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                    </>
                  )}
                  <DossierBadgeStatut statut={entree.statutApres} size="sm" />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {entree.effectueParNom} · {formatDateHeure(entree.effectueLe)}
                </p>

                {entree.commentaire && (
                  <p className="text-sm text-gray-700 mt-1 italic">
                    "{entree.commentaire}"
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
```

### Modal de changement de statut

```typescript
// components/dossiers/DossierActions.tsx
export function DossierActions({ dossier }: { dossier: DossierResponseDto }) {
  const { utilisateur } = useAuthStore();
  const { mutate: changerStatut, isPending } = useChangerStatut();
  const [modalOuverte, setModalOuverte] = useState(false);
  const [statutCible, setStatutCible] = useState<StatutDossier | null>(null);
  const [commentaire, setCommentaire] = useState('');

  // Calculer les actions disponibles pour ce rôle et ce statut
  const actionsDispo = getActionsDisponibles(dossier.statut, utilisateur?.role);

  if (dossier.statut === 'archive') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Archive className="h-4 w-4" />
            <span className="text-sm">Dossier archivé — lecture seule</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {actionsDispo.map((action) => (
            <button
              key={action.statut}
              onClick={() => { setStatutCible(action.statut); setModalOuverte(true); }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors',
                action.variante === 'danger'
                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                  : action.variante === 'success'
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
              )}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </button>
          ))}

          {actionsDispo.length === 0 && (
            <p className="text-sm text-gray-500">Aucune action disponible pour votre rôle</p>
          )}
        </CardContent>
      </Card>

      {/* Modal confirmation */}
      <Dialog open={modalOuverte} onOpenChange={setModalOuverte}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statutCible === 'rejete' ? 'Rejeter le dossier' : 'Confirmer l\'action'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {(statutCible === 'rejete' || statutCible === 'en_attente_client') && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  {statutCible === 'rejete'
                    ? 'Motif du rejet (obligatoire, min. 20 caractères)'
                    : 'Information manquante (facultatif)'}
                </label>
                <Textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder={statutCible === 'rejete'
                    ? 'Expliquez la raison du rejet en détail...'
                    : 'Précisez ce qui est attendu du client...'}
                  rows={4}
                />
                {statutCible === 'rejete' && commentaire.length < 20 && commentaire.length > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    {20 - commentaire.length} caractère(s) minimum requis
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOuverte(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                changerStatut(
                  { id: dossier.id, dto: { statut: statutCible!, commentaire } },
                  { onSuccess: () => setModalOuverte(false) },
                );
              }}
              disabled={
                isPending ||
                (statutCible === 'rejete' && commentaire.length < 20)
              }
              variant={statutCible === 'rejete' ? 'destructive' : 'default'}
            >
              {isPending ? <Spinner className="mr-2" /> : null}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## PAGE DE CONNEXION — DESIGN SOIGNÉ

```typescript
// pages/auth/LoginPage.tsx
export function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Archivage Électricité</h1>
          <p className="text-gray-500 mt-1 text-sm">Système de gestion des dossiers</p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Connexion</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{extraireMessageErreur(error)}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(login)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifiant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifiant</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="votre.identifiant"
                        autoComplete="username"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motDePasse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <PasswordInput autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending
                  ? <><Spinner className="mr-2 h-4 w-4" />Connexion...</>
                  : 'Se connecter'
                }
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Problème de connexion ? Contactez l'administrateur.
        </p>
      </div>
    </div>
  );
}
```

---

## RÈGLES DESIGN POUR L'INTERFACE MÉTIER

```
TYPOGRAPHIE
□ Titres de page : text-2xl font-bold text-gray-900
□ Sous-titres : text-base font-semibold text-gray-900
□ Numéros de dossier : font-mono (JetBrains Mono)
□ Texte courant : text-sm text-gray-700
□ Texte secondaire : text-sm text-gray-500
□ Labels de formulaire : text-sm font-medium text-gray-700

ESPACEMENT
□ Padding de page : p-6
□ Gap entre sections : gap-6
□ Espace interne carte : p-6
□ Espace entre champs formulaire : space-y-4

CARTES
□ Fond blanc bg-white
□ Bordure border border-gray-200
□ Coins arrondis rounded-lg (pas rounded-xl — trop doux pour du B2B)
□ Ombre légère shadow-sm

COULEURS D'ACTION
□ Action principale : bg-blue-600 hover:bg-blue-700
□ Action secondaire : border border-gray-300 hover:bg-gray-50
□ Action dangereuse : bg-red-600 hover:bg-red-700
□ Action succès : bg-green-600 hover:bg-green-700

ÉTATS DES FORMULAIRES
□ Focus : ring-2 ring-blue-500 ring-offset-2
□ Erreur : border-red-500 avec message rouge dessous
□ Disabled : opacity-50 cursor-not-allowed
```

---

## CHECKLIST DESIGN AVANT LIVRAISON

```
□ Les couleurs de statuts sont cohérentes sur toutes les pages
□ Les numéros de dossier sont en police monospace
□ Les tableaux ont des lignes alternées (hover:bg-gray-50)
□ Les boutons d'action principale sont identifiables d'un coup d'œil
□ Les modales de confirmation ont un titre explicite (pas juste "Confirmer ?")
□ Les formulaires ont un label visible sur chaque champ
□ Les messages d'erreur sont en rouge, positionnés sous le champ concerné
□ L'interface fonctionne à 1280px (desktop entreprise standard)
□ Les textes sont lisibles (contraste WCAG AA minimum)
□ Les actions destructives (rejet, invalidation) sont en rouge
□ Le chargement est signalé (skeleton ou spinner selon le contexte)
```
