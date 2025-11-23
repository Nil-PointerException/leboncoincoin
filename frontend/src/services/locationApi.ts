/**
 * Service pour l'autocomplete de localisation
 * Utilise l'API Adresse du gouvernement français (data.gouv.fr)
 * 
 * Documentation: https://adresse.data.gouv.fr/api-doc/adresse
 */

export interface LocationSuggestion {
  label: string
  city: string
  postcode: string
  context: string
}

/**
 * Recherche des suggestions de villes françaises
 * @param query - Texte de recherche (minimum 2 caractères)
 * @param limit - Nombre de résultats (par défaut 5)
 */
export async function searchLocations(
  query: string,
  limit: number = 5
): Promise<LocationSuggestion[]> {
  // Minimum 2 caractères pour la recherche
  if (query.length < 2) {
    return []
  }

  try {
    const url = new URL('https://api-adresse.data.gouv.fr/search/')
    url.searchParams.append('q', query)
    url.searchParams.append('type', 'municipality') // Communes uniquement
    url.searchParams.append('limit', limit.toString())
    url.searchParams.append('autocomplete', '1')

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      console.error('API Adresse error:', response.status)
      return []
    }

    const data = await response.json()

    // Transformer les résultats
    return data.features.map((feature: any) => ({
      label: feature.properties.label, // Ex: "Paris (75000)"
      city: feature.properties.city,   // Ex: "Paris"
      postcode: feature.properties.postcode, // Ex: "75000"
      context: feature.properties.context,   // Ex: "75, Paris, Île-de-France"
    }))
  } catch (error) {
    console.error('Error fetching location suggestions:', error)
    return []
  }
}

/**
 * Obtenir les suggestions formatées pour affichage
 */
export function formatLocationLabel(suggestion: LocationSuggestion): string {
  return `${suggestion.city} (${suggestion.postcode})`
}


