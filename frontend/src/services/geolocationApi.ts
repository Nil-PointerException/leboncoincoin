/**
 * Service de géolocalisation pour obtenir la position de l'utilisateur
 * et convertir les coordonnées GPS en nom de ville
 */

export interface GeolocationPosition {
  latitude: number
  longitude: number
}

export interface CityFromCoordinates {
  city: string
  postcode?: string
  label?: string
}

/**
 * Demande la permission de géolocalisation et obtient la position de l'utilisateur
 */
export async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        let errorMessage = 'Erreur de géolocalisation'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de géolocalisation refusée'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Délai d\'attente dépassé'
            break
        }
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: false, // Pas besoin de haute précision pour la ville
        timeout: 10000, // 10 secondes max
        maximumAge: 300000, // Accepter une position de moins de 5 minutes
      }
    )
  })
}

/**
 * Convertit des coordonnées GPS en nom de ville (géocodage inverse)
 * Utilise l'API Adresse de data.gouv.fr
 */
export async function getCityFromCoordinates(
  latitude: number,
  longitude: number
): Promise<CityFromCoordinates | null> {
  try {
    console.log('🗺️ Conversion coordonnées en ville:', { latitude, longitude })
    const url = new URL('https://api-adresse.data.gouv.fr/reverse/')
    url.searchParams.append('lat', latitude.toString())
    url.searchParams.append('lon', longitude.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      console.error('❌ API Reverse Geocoding error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    console.log('🗺️ Réponse API reverse geocoding:', data)

    if (data.features && data.features.length > 0) {
      const feature = data.features[0]
      const properties = feature.properties
      console.log('🗺️ Propriétés de la ville:', properties)

      const cityName = properties.city || properties.name || properties.municipality || ''
      const postcode = properties.postcode || undefined
      const label = properties.label || `${cityName}${postcode ? ` (${postcode})` : ''}`

      if (!cityName) {
        console.warn('⚠️ Aucun nom de ville trouvé dans les propriétés:', properties)
        return null
      }

      return {
        city: cityName,
        postcode: postcode,
        label: label,
      }
    }

    console.warn('⚠️ Aucune feature trouvée dans la réponse API')
    return null
  } catch (error) {
    console.error('❌ Error fetching city from coordinates:', error)
    return null
  }
}

/**
 * Obtient la ville actuelle de l'utilisateur via géolocalisation
 * Combine getCurrentPosition et getCityFromCoordinates
 */
export async function getCurrentCity(): Promise<CityFromCoordinates | null> {
  try {
    const position = await getCurrentPosition()
    const city = await getCityFromCoordinates(position.latitude, position.longitude)
    return city
  } catch (error) {
    console.error('Error getting current city:', error)
    return null
  }
}

