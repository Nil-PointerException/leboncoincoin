import {
  Devices,
  Computer,
  Chair,
  Checkroom,
  Watch,
  SportsSoccer,
  MenuBook,
  Toys,
  Home,
  Yard,
  Kitchen,
  Build,
  DirectionsCar,
  TwoWheeler,
  PedalBike,
  Work,
  Handyman,
  Pets,
  Face,
  MusicNote,
  Movie,
  Palette,
  ChildCare,
  Category as CategoryIcon,
} from '@mui/icons-material'
import type { SvgIconComponent } from '@mui/icons-material'
import type { Category } from './categories'

export const CATEGORY_ICONS: Record<Category, SvgIconComponent> = {
  'Électronique': Devices,
  'Informatique': Computer,
  'Mobilier': Chair,
  'Vêtements': Checkroom,
  'Chaussures': Checkroom,
  'Accessoires': Watch,
  'Sport & Loisirs': SportsSoccer,
  'Livres & Magazines': MenuBook,
  'Jeux & Jouets': Toys,
  'Maison & Jardin': Yard,
  'Électroménager': Kitchen,
  'Bricolage': Build,
  'Véhicules': DirectionsCar,
  'Moto': TwoWheeler,
  'Vélo': PedalBike,
  'Immobilier': Home,
  'Emploi': Work,
  'Services': Handyman,
  'Animaux': Pets,
  'Mode & Beauté': Face,
  'Musique': MusicNote,
  'Films & DVD': Movie,
  'Art & Collections': Palette,
  'Puériculture': ChildCare,
  'Autre': CategoryIcon,
}

// Helper function to get icon for a category
export const getCategoryIcon = (category: Category | string | undefined): SvgIconComponent => {
  if (!category || !(category in CATEGORY_ICONS)) {
    return CategoryIcon
  }
  return CATEGORY_ICONS[category as Category]
}

