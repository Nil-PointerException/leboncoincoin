# 🖼️ ImageSlider Component

Composant de slider d'images moderne avec navigation, thumbnails et zoom plein écran.

## ✨ Features

### Navigation
- ⬅️ **Boutons Précédent/Suivant** - Navigation entre les images
- 🖱️ **Thumbnails cliquables** - Accès direct à n'importe quelle image
- ⌨️ **Support clavier** - Flèches pour naviguer (à venir)
- 📱 **Swipe mobile** - Glisser pour changer d'image (à venir)

### Zoom
- 🔍 **Bouton Zoom** - Ouvre l'image en plein écran
- 🖼️ **Modal de zoom** - Fond noir à 95% d'opacité
- ❌ **Fermeture facile** - Clic sur le fond ou bouton X
- 🎯 **Navigation dans le zoom** - Boutons et thumbnails disponibles

### UI/UX
- 🎨 **Design moderne** - Backdrop blur, transitions smooth
- 📊 **Compteur d'images** - "X / Y" affiché en permanence
- 🌈 **Gradient overlay** - Overlay en bas de l'image principale
- 📱 **Responsive** - S'adapte aux petits écrans
- 🎭 **Animations** - Fade-in, scale, hover effects

### Performance
- ⚡ **Optimisé** - Images chargées à la demande
- 🎯 **Scroll personnalisé** - Scrollbar stylisée pour thumbnails
- 🔄 **Transitions fluides** - 0.2s-0.3s ease

## 📦 Installation

Le composant est déjà inclus dans `/src/components/ImageSlider.tsx`

## 🚀 Usage

### Basique

```tsx
import ImageSlider from '@/components/ImageSlider'

const images = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
]

<ImageSlider images={images} alt="Mon produit" />
```

### Avec placeholder

```tsx
const images = listing.imageUrls?.length > 0 
  ? listing.imageUrls 
  : ['https://via.placeholder.com/800x600?text=🦆+Pas+d\'image']

<ImageSlider images={images} alt={listing.title} />
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `images` | `string[]` | ✅ Yes | - | Tableau d'URLs d'images |
| `alt` | `string` | ❌ No | `'Image'` | Texte alternatif pour accessibilité |

## 🎨 Apparence

### Image principale
- **Hauteur:** 500px (desktop), 400px (tablet), 300px (mobile)
- **Background:** Noir (`grey.900`)
- **Object-fit:** `contain` (garde les proportions)
- **Border-radius:** 12px

### Thumbnails
- **Taille:** 100×75px (desktop), 80×60px (mobile)
- **Espacement:** 12px
- **Border:** 3px jaune pour l'image active
- **Opacité:** 60% inactif, 100% actif/hover
- **Scroll:** Horizontal avec scrollbar stylisée

### Boutons
- **Navigation:** Ronds, fond noir semi-transparent, blur
- **Zoom:** En haut à gauche
- **Compteur:** En haut à droite
- **Hover:** Scale 1.05-1.1

### Modal Zoom
- **Background:** `rgba(0, 0, 0, 0.95)`
- **Z-index:** 9999
- **Image:** 95% max width/height
- **Animation:** Fade-in 0.2s

## 🎯 États

### Aucune image

Si le tableau `images` est vide, affiche un placeholder avec un canard :

```
🦆
Aucune image disponible
```

### Image unique

- Pas de boutons de navigation
- Pas de thumbnails
- Bouton zoom disponible

### Plusieurs images

- Tous les contrôles disponibles
- Thumbnails scrollables horizontalement
- Navigation complète

## 💡 Exemples d'utilisation

### Dans ListingDetailPage

```tsx
import ImageSlider from '@/components/ImageSlider'

const images = listing.imageUrls?.length > 0 
  ? listing.imageUrls 
  : ['https://via.placeholder.com/800x600?text=No+Image']

<Grid item xs={12} md={7}>
  <ImageSlider images={images} alt={listing.title} />
</Grid>
```

### Galerie de produits

```tsx
export default function ProductGallery({ product }) {
  return (
    <Container>
      <ImageSlider 
        images={product.images} 
        alt={product.name}
      />
    </Container>
  )
}
```

## 🔧 Personnalisation

### Changer la hauteur

```tsx
// Modifier directement dans ImageSlider.tsx
height: { xs: 400, sm: 500, md: 600 }, // Lignes 63-64
```

### Changer les couleurs des boutons

```tsx
// Dans les sx des IconButton
bgcolor: 'rgba(255, 215, 0, 0.7)', // Jaune au lieu de noir
```

### Ajouter un background pattern

```tsx
// Dans le Paper principal
sx={{
  background: 'linear-gradient(45deg, #000 25%, #111 25%, #111 50%, #000 50%)',
  backgroundSize: '20px 20px',
}}
```

## ⌨️ Raccourcis clavier (à venir)

- `←` Flèche gauche - Image précédente
- `→` Flèche droite - Image suivante
- `Esc` - Fermer le zoom
- `Space` - Zoom in/out

## 📱 Gestes tactiles (à venir)

- **Swipe left/right** - Navigation
- **Pinch to zoom** - Zoom
- **Double tap** - Zoom rapide

## 🐛 Troubleshooting

### Les images ne s'affichent pas

1. Vérifier que les URLs sont valides
2. Vérifier les CORS si images externes
3. Vérifier le format (jpg, png, webp supportés)

### Les thumbnails ne scrollent pas

Le scroll est horizontal avec `overflowX: 'auto'`. Si pas visible :
- Vérifier qu'il y a > 5 images
- Vérifier la largeur du conteneur

### Le zoom ne fonctionne pas

1. Vérifier le z-index (doit être > autres modals)
2. Vérifier que le modal n'est pas bloqué par un parent

## 🎨 Intégration avec le Design System

Le composant utilise :
- ✅ Theme MUI (couleurs, spacing)
- ✅ Transitions cohérentes
- ✅ Border radius du design system (12px)
- ✅ Couleur primary pour les borders actives
- ✅ Backdrop blur pour effet glassmorphism

## 📊 Performance

- **Lazy loading** - Images chargées à la demande
- **Optimisations** - `object-fit: contain` au lieu de `cover`
- **Pas de bibliothèque externe** - Tout en MUI natif
- **Taille** - ~10KB (non minifié)

## 🔜 Améliorations futures

- [ ] Support des vidéos
- [ ] Swipe mobile
- [ ] Raccourcis clavier
- [ ] Lazy loading des thumbnails
- [ ] Mode plein écran (fullscreen API)
- [ ] Partage d'image
- [ ] Download d'image
- [ ] Zoom progressif (pinch to zoom)

---

**🦆 Composant créé pour LeBonCoinCoin avec amour !**


