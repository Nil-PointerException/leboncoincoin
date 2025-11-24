# 🔍 ListingFilters Component

Composant de filtrage avancé pour la recherche d'annonces avec autocomplete de localisation.

## ✨ Features

### Champs de recherche

1. **🔎 Recherche textuelle**
   - Placeholder: "Rechercher par titre ou description..."
   - Recherche en appuyant sur Entrée
   - Icône de recherche intégrée

2. **📂 Catégorie**
   - Select avec toutes les catégories
   - Option "Toutes catégories" par défaut
   - Icônes pour meilleure UX
   - Affichage personnalisé avec `renderValue`

3. **📍 Localisation (Autocomplete)**
   - Autocomplete avec suggestions en temps réel
   - Powered by `locationApi` (api-adresse.data.gouv.fr)
   - Affiche ville, code postal et contexte
   - Recherche à partir de 2 caractères
   - Freesolo (permet saisie manuelle)

4. **💰 Prix Min/Max**
   - Champs numériques
   - Icône Euro
   - Validation min: 0

### Boutons d'action

- **Filtrer** - Applique les filtres sélectionnés
- **Réinitialiser** - Efface tous les filtres et recharge toutes les annonces

## 🎨 Design

### Layout Responsive

```
Desktop (>= md):
┌──────────────────────────────────────────────┐
│  [Recherche texte (50%)]  [Catégorie] [Loc]  │
│  [Prix min] [Prix max]     [Filtrer] [Reset] │
└──────────────────────────────────────────────┘

Mobile (< md):
┌──────────────────┐
│ [Recherche]      │
│ [Catégorie]      │
│ [Localisation]   │
│ [Prix min] [Max] │
│ [Filtrer]        │
│ [Réinitialiser]  │
└──────────────────┘
```

### Couleurs et Style

- **Background**: Gradient jaune/orange léger
- **Champs**: Fond blanc avec border
- **Boutons**: Primary (jaune) et Secondary (orange)
- **Elevation**: 3 avec border radius 3
- **Spacing**: Stack spacing 2.5, Grid spacing 2

### Icônes

| Champ | Icône |
|-------|-------|
| Recherche | `SearchIcon` |
| Catégorie | `CategoryIcon` |
| Localisation | `LocationOnIcon` |
| Prix | `EuroIcon` |
| Filtrer | `FilterListIcon` |
| Réinitialiser | `RestartAltIcon` |

## 📦 Props

```typescript
interface ListingFiltersProps {
  onFilter: (filters: ListingFilter) => void
}
```

### onFilter

Callback appelé lorsque l'utilisateur clique sur "Filtrer" ou "Réinitialiser".

**Type:** `(filters: ListingFilter) => void`

**Paramètre `filters`:**
```typescript
interface ListingFilter {
  search?: string
  category?: string
  location?: string
  minPrice?: number
  maxPrice?: number
}
```

## 🚀 Usage

### Basique

```tsx
import ListingFilters from '@/components/ListingFilters'
import type { ListingFilter } from '@/types'

export default function HomePage() {
  const handleFilter = (filters: ListingFilter) => {
    console.log('Filtres appliqués:', filters)
    // Fetch listings avec les filtres
    fetchListings(filters)
  }

  return (
    <Container>
      <ListingFilters onFilter={handleFilter} />
      {/* Listings grid */}
    </Container>
  )
}
```

### Avec gestion d'état

```tsx
const [listings, setListings] = useState<Listing[]>([])
const [loading, setLoading] = useState(false)

const fetchListings = async (filters?: ListingFilter) => {
  setLoading(true)
  try {
    const data = await listingsApi.getAll(filters)
    setListings(data)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    setLoading(false)
  }
}

const handleFilter = (filters: ListingFilter) => {
  fetchListings(filters)
}

return (
  <>
    <ListingFilters onFilter={handleFilter} />
    {loading ? <CircularProgress /> : <ListingsGrid listings={listings} />}
  </>
)
```

## 🎯 Comportements

### Recherche par Entrée

L'utilisateur peut appuyer sur **Entrée** dans le champ de recherche pour déclencher le filtrage.

```tsx
onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
```

### Autocomplete Localisation

1. **Saisie < 2 caractères** → Pas de suggestions
2. **Saisie ≥ 2 caractères** → Appel API pour suggestions
3. **Sélection** → Formatage "Ville (Code postal)"
4. **Freesolo** → Permet saisie manuelle sans sélection

```tsx
onInputChange={(_, newValue) => {
  setLocationInputValue(newValue)
  handleLocationSearch(newValue)
}}
```

### Réinitialisation

Efface tous les filtres ET l'input de localisation :

```tsx
const handleReset = () => {
  setFilters({})
  setLocationInputValue('')  // Important !
  onFilter({})
}
```

## 🔧 API de Localisation

### Service `locationApi`

**Fichier:** `frontend/src/services/locationApi.ts`

**Fonction:** `searchLocations(query: string): Promise<LocationSuggestion[]>`

**Type LocationSuggestion:**
```typescript
interface LocationSuggestion {
  city: string
  postcode: string
  context: string
  label: string
  coordinates: [number, number]
}
```

**API utilisée:** https://api-adresse.data.gouv.fr

**Exemple de requête:**
```
GET https://api-adresse.data.gouv.fr/search/?q=Paris&type=municipality&limit=5
```

**Exemple de réponse:**
```json
{
  "features": [
    {
      "properties": {
        "city": "Paris",
        "postcode": "75001",
        "context": "Paris, Île-de-France",
        "label": "Paris",
        "x": 2.3522,
        "y": 48.8566
      }
    }
  ]
}
```

## 🎨 Personnalisation

### Changer les couleurs

```tsx
<Paper 
  sx={{ 
    background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.05) 0%, rgba(0, 100, 200, 0.05) 100%)',
  }}
>
```

### Modifier le nombre de suggestions

Dans `locationApi.ts`:
```typescript
const response = await axios.get(
  `https://api-adresse.data.gouv.fr/search/`,
  { params: { q: query, type: 'municipality', limit: 10 } }  // ← Modifier ici
)
```

### Ajouter un filtre

1. **Ajouter au type `ListingFilter`**:
```typescript
interface ListingFilter {
  // ...
  condition?: 'new' | 'used'
}
```

2. **Ajouter le champ dans le composant**:
```tsx
<TextField
  select
  value={filters.condition || ''}
  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
>
  <MenuItem value="">Toutes</MenuItem>
  <MenuItem value="new">Neuf</MenuItem>
  <MenuItem value="used">Occasion</MenuItem>
</TextField>
```

3. **Backend**: Ajouter le filtre dans `ListingRepository`

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `xs` (0-600px) | Vertical stack, boutons pleine largeur |
| `sm` (600-900px) | 2 colonnes pour prix, boutons partagés |
| `md` (900-1200px) | Grid complet, 3 colonnes ligne 1 |
| `lg+` (>1200px) | Idem md avec plus d'espacement |

### Grid Sizes

**Ligne 1:**
- Recherche: `xs={12} md={6}`
- Catégorie: `xs={12} md={3}`
- Localisation: `xs={12} md={3}`

**Ligne 2:**
- Prix min: `xs={6} sm={3} md={2}`
- Prix max: `xs={6} sm={3} md={2}`
- Boutons: `xs={12} sm={6} md={8}`

## 🐛 Résolution de problèmes

### "Toutes" superposé avec "Catégorie"

**Cause:** Pas de `renderValue` personnalisé.

**Solution:** Utiliser `renderValue` dans `SelectProps`:
```tsx
SelectProps={{
  displayEmpty: true,
  renderValue: (value: any) => {
    if (!value) {
      return <span>Toutes catégories</span>
    }
    return <span>{value}</span>
  },
}}
```

### Autocomplete ne cherche pas

**Cause:** API non appelée ou erreur CORS.

**Vérifications:**
1. `handleLocationSearch` appelé dans `onInputChange`
2. Query length ≥ 2
3. API accessible (test dans le navigateur)

### Boutons dépassent de la div

**Cause:** Mauvaise gestion du `flex` ou `Grid`.

**Solution:** Utiliser `justifyContent` et `flex`:
```tsx
<Box sx={{ 
  display: 'flex', 
  gap: 2, 
  justifyContent: { xs: 'stretch', md: 'flex-end' } 
}}>
  <Button sx={{ flex: { xs: 1, md: 0 } }}>Filtrer</Button>
  <Button sx={{ flex: { xs: 1, md: 0 } }}>Reset</Button>
</Box>
```

### Filtres ne s'appliquent pas

**Cause:** `undefined` vs `''` vs `null`.

**Solution:** Utiliser `undefined` pour valeurs vides:
```tsx
onChange={(e) => setFilters({ 
  ...filters, 
  category: e.target.value || undefined  // ← Important
})}
```

## 🧪 Tests

### Test Manuel

1. **Recherche textuelle**
   - Taper "iPhone" → Vérifier filtrage
   - Appuyer sur Entrée → Doit filtrer

2. **Catégorie**
   - Sélectionner "Électronique" → Filtrer
   - Vérifier affichage "Toutes catégories" au reset

3. **Localisation**
   - Taper "Pa" → Pas de suggestions
   - Taper "Par" → Suggestions apparaissent
   - Sélectionner "Paris (75001)" → Format correct
   - Taper manuellement "Lyon" → Accepté (freesolo)

4. **Prix**
   - Min: 50, Max: 200 → Filtrer
   - Vérifier validation (pas de négatifs)

5. **Réinitialiser**
   - Cliquer → Tous les champs vides
   - Toutes les annonces rechargées

### Test avec Playwright

```typescript
test('should filter listings by category', async ({ page }) => {
  await page.goto('/')
  
  // Ouvrir select catégorie
  await page.click('text=Toutes catégories')
  
  // Sélectionner Électronique
  await page.click('text=Électronique')
  
  // Cliquer filtrer
  await page.click('button:has-text("Filtrer")')
  
  // Vérifier résultats
  await expect(page.locator('.listing-card')).toContainText('Électronique')
})

test('should autocomplete location', async ({ page }) => {
  await page.goto('/')
  
  // Taper dans localisation
  await page.fill('input[placeholder="Localisation"]', 'Paris')
  
  // Attendre suggestions
  await page.waitForSelector('text=Paris (75001)')
  
  // Cliquer sur suggestion
  await page.click('text=Paris (75001)')
  
  // Vérifier valeur
  const value = await page.inputValue('input[placeholder="Localisation"]')
  expect(value).toContain('Paris')
})
```

## 🚀 Améliorations futures

- [ ] Sauvegarde des filtres dans URL (query params)
- [ ] Historique des recherches (localStorage)
- [ ] Suggestions de recherche (mots-clés populaires)
- [ ] Filtre par date de publication
- [ ] Filtre par état (neuf/occasion)
- [ ] Tri (prix, date, pertinence)
- [ ] Recherche géographique (rayon en km)
- [ ] Vue carte avec markers
- [ ] Export des résultats (CSV, PDF)

## 📚 Ressources

- [MUI Autocomplete](https://mui.com/material-ui/react-autocomplete/)
- [MUI TextField](https://mui.com/material-ui/react-text-field/)
- [API Adresse](https://adresse.data.gouv.fr/api-doc/adresse)
- [React Controlled Components](https://react.dev/learn/sharing-state-between-components)

---

**🦆 Composant optimisé pour LeBonCoinCoin !**


