import { Link } from '@/components/link-card'
import { useState, useMemo } from 'react'

/**
 * Custom hook for managing link search functionality with URL synchronization
 * @param links - Array of Link objects to be searched
 * @returns Object containing search state and handlers
 */
export function useSearchLinks(links: Link[]) {
  /**
   * Helper function to get URL search parameters
   */
  const getSearchParams = () => {
    return new URLSearchParams(window.location.search)
  }

  /**
   * Helper function to get search term from URL parameters
   * @returns Current search term from URL or empty string
   */
  const getSearchTerm = () => {
    return getSearchParams().get('search') || ''
  }

  // Initialize search term state from URL
  const [searchTerm, setSearchTerm] = useState(getSearchTerm())
  /**
   * Memoized filtered links based on search term
   * Only recomputes when links array or search term changes
   */
  const filteredLinks = useMemo(() => {
    if (!searchTerm) return links
    return links.filter((link) => link.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [links, searchTerm])
  /**
   * Updates the URL search parameters based on search term
   * @param term - Search term to be reflected in URL
   */
  const updateUrl = (term: string) => {
    const params = getSearchParams()
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    const newParams = params.toString()
    const newUrl = `${window.location.pathname}${
      newParams ? `?${newParams}` : ''
    }`
    window.history.replaceState({}, '', newUrl)
  }
  /**
   * Handler for search term updates
   * Updates both state and URL
   * @param newSearchTerm - New search term to be applied
   */
  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
    updateUrl(newSearchTerm)
  }
  return {
    searchTerm,
    filteredLinks,
    handleSearch,
  }
}
