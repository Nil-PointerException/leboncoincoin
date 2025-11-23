/**
 * Catégories disponibles pour les annonces
 */
export const CATEGORIES = [
  'Électronique',
  'Informatique',
  'Mobilier',
  'Vêtements',
  'Chaussures',
  'Accessoires',
  'Sport & Loisirs',
  'Livres & Magazines',
  'Jeux & Jouets',
  'Maison & Jardin',
  'Électroménager',
  'Bricolage',
  'Véhicules',
  'Moto',
  'Vélo',
  'Immobilier',
  'Emploi',
  'Services',
  'Animaux',
  'Mode & Beauté',
  'Musique',
  'Films & DVD',
  'Art & Collections',
  'Puériculture',
  'Autre',
] as const

export type Category = typeof CATEGORIES[number]


