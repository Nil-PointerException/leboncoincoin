import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

export default function SEO({
  title = 'LeBonCoinCoin - Petites Annonces en ligne',
  description = 'Plateforme de petites annonces moderne et sécurisée. Achetez, vendez et échangez facilement en toute simplicité.',
  keywords = 'petites annonces, acheter, vendre, échanger, occasion, leboncoincoin, marketplace, annonces gratuites',
  image = '/og-image.png',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let element = document.querySelector(selector) as HTMLMetaElement

      if (!element) {
        element = document.createElement('meta')
        if (isProperty) {
          element.setAttribute('property', name)
        } else {
          element.setAttribute('name', name)
        }
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)

    // Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:site_name', 'LeBonCoinCoin', true)
    updateMetaTag('og:locale', 'fr_FR', true)

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // Add JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'LeBonCoinCoin',
      description: description,
      url: url.split('?')[0], // Remove query params for base URL
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${url.split('?')[0]}?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }

    // Remove existing JSON-LD script
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new JSON-LD script
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(jsonLd)
    document.head.appendChild(script)
  }, [title, description, keywords, image, url, type])

  return null
}

