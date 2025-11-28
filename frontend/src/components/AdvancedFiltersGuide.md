# 🎛️ Guide des Filtres Avancés

Système de filtres avancés avec modale interactive pour une recherche plus précise.

## ✨ Nouvelles fonctionnalités

### Bouton "Filtres avancés"

Un bouton **"Avancés"** a été ajouté à côté du bouton "Filtrer" pour ouvrir une modale avec des options de filtrage supplémentaires.

```
[Filtrer] [Avancés] [🔄]
```

### Bouton Réinitialiser optimisé

Le bouton "Réinitialiser" est maintenant un **IconButton** compact avec juste l'icône `RestartAltIcon`, ce qui économise de l'espace.

## 🎨 Interface

### Barre principale

```
┌──────────────────────────────────────────────┐
│ [Recherche]  [Catégorie] [Localisation]      │
│ [Prix min] [Prix max]  [Filtrer][Avancés][🔄]│
└──────────────────────────────────────────────┘
```

**Boutons:**
- **Filtrer** - Applique les filtres simples (primary, large)
- **Avancés** - Ouvre la modale (primary outlined, medium)
- **🔄** - Réinitialise tout (IconButton avec border)

### Modale Filtres Avancés

```
┌─────────────────────────────────────┐
│ 🎛️ Filtres avancés            [X]  │
├─────────────────────────────────────┤
│                                     │
│ 💰 Fourchette de prix               │
│ ├─────○────────────○─────┤          │
│ [0€] [2500€] [5000€] [10k€]        │
│ [Min: ___] [Max: ___]               │
│                                     │
│ ─────────────────────────────────  │
│                                     │
│ 📂 Catégories multiples             │
│ [Électronique] [Véhicules] ...     │
│ (chips cliquables)                  │
│                                     │
│ ─────────────────────────────────  │
│                                     │
│ 🔮 Fonctionnalités à venir          │
│ [ ] Annonces avec images            │
│ [ ] Trier par pertinence            │
│ [ ] Annonces urgentes               │
│                                     │
├─────────────────────────────────────┤
│ [Réinitialiser]  [Annuler][Appliquer]│
└─────────────────────────────────────┘
```

## 🔧 Filtres disponibles

### 1. Fourchette de prix (Slider)

**Composant:** `Slider` MUI

**Fonctionnalité:**
- Slider interactif avec deux poignées (min/max)
- Range: 0€ à 10 000€
- Pas de 50€
- Marks à 0, 2500, 5000, 7500, 10 000€
- Valeur affichée en temps réel (`valueLabelDisplay="auto"`)
- Champs texte synchronisés en dessous

**Code:**
```tsx
<Slider
  value={[filters.minPrice || 0, filters.maxPrice || 10000]}
  onChange={(_, newValue) => {
    const [min, max] = newValue as number[]
    setFilters({ 
      ...filters, 
      minPrice: min > 0 ? min : undefined,
      maxPrice: max < 10000 ? max : undefined 
    })
  }}
  min={0}
  max={10000}
  step={50}
  marks={[...]}
/>
```

**Points clés:**
- ✅ Valeur non définie si min=0 ou max=10000 (valeurs par défaut)
- ✅ Synchronisation bidirectionnelle avec les TextFields
- ✅ Styling personnalisé (primary color)

### 2. Catégories multiples (Chips)

**Composant:** `Chip` MUI

**Fonctionnalité:**
- Affichage de toutes les catégories sous forme de chips
- Clic pour sélectionner/désélectionner
- Visuel différent pour catégorie sélectionnée (filled vs outlined)
- Icône `CategoryIcon` sur chaque chip
- Animation au hover (scale 1.05)

**Code:**
```tsx
{CATEGORIES.map((category) => (
  <Chip
    key={category}
    label={category}
    onClick={() => {
      setFilters({ 
        ...filters, 
        category: filters.category === category ? undefined : category 
      })
    }}
    color={filters.category === category ? 'primary' : 'default'}
    variant={filters.category === category ? 'filled' : 'outlined'}
    icon={<CategoryIcon fontSize="small" />}
  />
))}
```

**Note:** Pour l'instant, une seule catégorie à la fois (toggle). Extension future pour multi-sélection.

### 3. Fonctionnalités à venir

Section informative avec des switches désactivés pour montrer les futures fonctionnalités :
- ✅ Trier par pertinence
- ✅ Afficher annonces urgentes en premier


## 🎯 Comportements

### Ouverture de la modale

```typescript
const [advancedOpen, setAdvancedOpen] = useState(false)

<Button onClick={() => setAdvancedOpen(true)}>
  Avancés
</Button>
```

### Fermeture de la modale

Trois façons:
1. **Bouton X** (en haut à droite)
2. **Bouton Annuler**
3. **Clic en dehors** (comportement par défaut MUI Dialog)

```typescript
<IconButton onClick={() => setAdvancedOpen(false)}>
  <CloseIcon />
</IconButton>
```

### Application des filtres

```typescript
<Button
  onClick={() => {
    handleSearch()          // Applique les filtres
    setAdvancedOpen(false)  // Ferme la modale
  }}
>
  Appliquer
</Button>
```

### Réinitialisation

**Dans la modale:**
```typescript
<Button
  onClick={() => {
    setFilters({})
    setLocationInputValue('')
  }}
>
  Réinitialiser
</Button>
```

**Dans la barre principale:**
```typescript
<IconButton onClick={handleReset}>
  <RestartAltIcon />
</IconButton>
```

## 📱 Responsive

### Desktop (≥ md)

```
Barre principale:
[Recherche (50%)] [Catégorie] [Loc]
[Min][Max]        [Filtrer][Avancés][🔄]

Modale: 
maxWidth="md" (900px) fullWidth
```

### Mobile (< md)

```
Barre principale:
[Recherche]
[Catégorie]
[Localisation]
[Min][Max]
[Filtrer]
[Avancés]
[🔄]

Modale:
fullWidth avec padding réduit
```

## 🎨 Styling

### Bouton "Avancés"

```tsx
<Button
  variant="outlined"
  color="primary"
  size="medium"
  startIcon={<TuneIcon />}
  sx={{
    fontWeight: 600,
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
      bgcolor: 'primary.light',
    },
  }}
>
  Avancés
</Button>
```

**Points clés:**
- ✅ `variant="outlined"` pour différencier de "Filtrer"
- ✅ `size="medium"` (plus petit que "Filtrer")
- ✅ Border width 2 pour cohérence
- ✅ Hover avec background primary.light

### IconButton Réinitialiser

```tsx
<IconButton
  color="secondary"
  onClick={handleReset}
  size="large"
  sx={{
    border: 2,
    borderColor: 'secondary.main',
    borderRadius: 2,
    '&:hover': {
      bgcolor: 'secondary.light',
      borderColor: 'secondary.dark',
    },
  }}
  title="Réinitialiser"
>
  <RestartAltIcon />
</IconButton>
```

**Points clés:**
- ✅ Border 2px pour ressembler à un bouton outlined
- ✅ `title` pour tooltip au hover
- ✅ `borderRadius: 2` (8px) au lieu de circle
- ✅ Color secondary pour différencier

### Modale

```tsx
<Dialog
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      maxHeight: '90vh',
    }
  }}
>
```

**Points clés:**
- ✅ `maxWidth="md"` (900px)
- ✅ `borderRadius: 3` (12px) cohérent avec design system
- ✅ `maxHeight: 90vh` pour éviter débordement sur petits écrans

## 💡 Exemples

### Utilisation basique

```tsx
import ListingFilters from '@/components/ListingFilters'

<ListingFilters onFilter={handleFilter} />
```

### Workflow complet

1. **Utilisateur** clique sur "Avancés"
2. **Modale** s'ouvre
3. **Utilisateur** ajuste le slider de prix (100€ - 500€)
4. **Utilisateur** sélectionne "Électronique"
5. **Utilisateur** clique "Appliquer"
6. **Modale** se ferme
7. **Filtres** sont appliqués

### État des filtres

```typescript
{
  search: "iPhone",
  category: "Électronique",
  location: "Paris (75001)",
  minPrice: 100,
  maxPrice: 500
}
```

## 🔮 Extensions futures

### Multi-sélection catégories

Actuellement: Toggle une seule catégorie.

**Future:**
```typescript
const [selectedCategories, setSelectedCategories] = useState<string[]>([])

const toggleCategory = (cat: string) => {
  setSelectedCategories(prev => 
    prev.includes(cat) 
      ? prev.filter(c => c !== cat)
      : [...prev, cat]
  )
}
```

### Tri

Ajouter un select pour le tri:
```tsx
<TextField
  select
  label="Trier par"
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
>
  <MenuItem value="date-desc">Plus récent</MenuItem>
  <MenuItem value="date-asc">Plus ancien</MenuItem>
  <MenuItem value="price-asc">Prix croissant</MenuItem>
  <MenuItem value="price-desc">Prix décroissant</MenuItem>
</TextField>
```


Backend:
```java
if (filter.imagesOnly != null && filter.imagesOnly) {
    predicates.add(cb.isNotEmpty(root.get("imageUrls")));
}
```

### Rayon géographique

```tsx
<Box>
  <Typography>Rayon autour de la localisation</Typography>
  <Slider
    value={radius}
    onChange={(_, val) => setRadius(val as number)}
    min={1}
    max={100}
    marks={[
      { value: 1, label: '1km' },
      { value: 25, label: '25km' },
      { value: 50, label: '50km' },
      { value: 100, label: '100km' },
    ]}
  />
</Box>
```

Nécessite calcul de distance géographique côté backend.

### Date de publication

```tsx
<TextField
  select
  label="Publié dans les"
  value={publishedWithin}
>
  <MenuItem value="1d">Dernières 24h</MenuItem>
  <MenuItem value="3d">3 derniers jours</MenuItem>
  <MenuItem value="7d">7 derniers jours</MenuItem>
  <MenuItem value="30d">30 derniers jours</MenuItem>
</TextField>
```

## 🐛 Résolution de problèmes

### Modale ne s'ouvre pas

**Vérifications:**
1. State `advancedOpen` bien initialisé
2. Event handler `onClick` bien attaché
3. Pas d'erreur console

### Slider ne bouge pas

**Cause:** Value non contrôlée ou range inversé.

**Solution:**
```tsx
value={[
  Math.min(filters.minPrice || 0, filters.maxPrice || 10000),
  Math.max(filters.minPrice || 0, filters.maxPrice || 10000)
]}
```

### Filtres ne s'appliquent pas

**Cause:** `handleSearch()` non appelé ou modale pas fermée.

**Solution:**
```tsx
onClick={() => {
  handleSearch()          // ← Important
  setAdvancedOpen(false)  // ← Important
}}
```

## 📊 Comparaison Avant/Après

### Avant

```
Boutons: [Filtrer (large)] [Réinitialiser (large)]
```

**Problèmes:**
- ❌ Bouton réinitialiser trop gros
- ❌ Pas de filtres avancés
- ❌ Layout encombré sur mobile

### Après

```
Boutons: [Filtrer (large)] [Avancés (medium)] [🔄 (icon)]
```

**Améliorations:**
- ✅ Bouton réinitialiser compact (IconButton)
- ✅ Filtres avancés dans modale
- ✅ Layout optimisé
- ✅ Plus d'espace pour autres champs
- ✅ Meilleur UX mobile

## 📚 Ressources

- [MUI Dialog](https://mui.com/material-ui/react-dialog/)
- [MUI Slider](https://mui.com/material-ui/react-slider/)
- [MUI Chip](https://mui.com/material-ui/react-chip/)
- [MUI IconButton](https://mui.com/material-ui/api/icon-button/)

---

**🦆🎛️ Filtres avancés implémentés pour LeBonCoinCoin !**


