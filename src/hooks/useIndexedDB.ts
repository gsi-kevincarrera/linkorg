import { Link } from '@/components/link-card'
import { useEffect, useState } from 'react'

/**
 * Possible states for the IndexedDB operations
 */
type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * State interface for IndexedDB operations
 */
interface IndexedDBState {
  status: Status
  data: Link[]
  error: Error | null
}

/**
 * Custom hook for managing IndexedDB operations with links
 * Provides state management and CRUD operations for links stored in IndexedDB
 *
 * @param dbName - Name of the IndexedDB database (defaults to 'LinkOrgDB')
 * @param storeName - Name of the object store (defaults to 'links')
 * @returns Object containing state and methods for managing links
 */
export function useIndexedDB(
  dbName: string = 'LinkOrgDB',
  storeName: string = 'links'
) {
  // Main state containing status, data and error information
  const [state, setState] = useState<IndexedDBState>({
    status: 'idle',
    data: [],
    error: null,
  })

  // Store the database connection
  const [db, setDb] = useState<IDBDatabase | null>(null)

  // Initialize the database connection and load initial data
  useEffect(() => {
    setState((prevState) => ({ ...prevState, status: 'loading' }))

    // Open or create the IndexedDB database
    const request = indexedDB.open(dbName, 1)

    // Called when the database is created or version is upgraded
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result
      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
      }
    }

    // Called when the database is successfully opened
    request.onsuccess = (event: Event) => {
      const database = (event.target as IDBOpenDBRequest).result
      setDb(database)

      // Load all links from the database
      const transaction = database.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const getAllRequest = store.getAll()

      // Update state with loaded links
      getAllRequest.onsuccess = () => {
        setState({
          status: 'success',
          data: getAllRequest.result as Link[],
          error: null,
        })
      }

      // Handle errors when loading links
      getAllRequest.onerror = (event) => {
        setState({
          status: 'error',
          data: [],
          error: new Error(
            `Error retrieving links: ${(event.target as IDBRequest).error}`
          ),
        })
      }
    }

    // Handle errors when opening the database
    request.onerror = (event: Event) => {
      setState({
        status: 'error',
        data: [],
        error: new Error(
          `Error opening IndexedDB: ${(event.target as IDBOpenDBRequest).error}`
        ),
      })
    }
  }, [dbName, storeName])

  /**
   * Refreshes the links data from the database
   * Updates the state with the latest links
   */
  const refreshLinks = () => {
    if (!db) return

    setState((prevState) => ({ ...prevState, status: 'loading' }))

    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    // Update state with refreshed links
    request.onsuccess = () => {
      setState({
        status: 'success',
        data: request.result as Link[],
        error: null,
      })
    }

    // Handle errors while refreshing links
    request.onerror = (event) => {
      setState((prevState) => ({
        status: 'error',
        data: prevState.data, // Keep existing data on error
        error: new Error(
          `Error refreshing links: ${(event.target as IDBRequest).error}`
        ),
      }))
    }
  }

  /**
   * Adds a new link to the database
   *
   * @param link - Link object without ID (ID will be auto-generated)
   * @returns Promise resolving to the complete link with generated ID
   */
  const addLink = (link: Omit<Link, 'id'>): Promise<Link> => {
    return new Promise((resolve, reject) => {
      // Check if database is initialized
      if (!db) {
        const error = new Error('Database not initialized')
        setState((prevState) => ({ ...prevState, error, status: 'error' }))
        reject(error)
        return
      }

      // Create transaction to add the link
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(link)

      // Handle successful link addition
      request.onsuccess = (event) => {
        const id = (event.target as IDBRequest).result
        const newLink = { ...link, id }

        // Update state with the new link
        setState((prevState) => ({
          status: 'success',
          data: [...prevState.data, newLink],
          error: null,
        }))

        resolve(newLink)
      }

      // Handle errors when adding a link
      request.onerror = (event) => {
        const error = new Error(
          `Error adding link: ${(event.target as IDBRequest).error}`
        )
        setState((prevState) => ({
          ...prevState,
          status: 'error',
          error,
        }))
        reject(error)
      }
    })
  }

  const deleteLink = (id: string) => {
    return new Promise((resolve, reject) => {
      // Check if database is initialized
      if (!db) {
        const error = new Error('Database not initialized')
        setState((prevState) => ({ ...prevState, error, status: 'error' }))
        reject(error)
        return
      }

      // Create transaction to delete the link
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      // Handle successful link deletion
      request.onsuccess = () => {
        setState((prevState) => ({
          status: 'success',
          data: prevState.data.filter((link) => link.id !== id),
          error: null,
        }))

        resolve(id)
      }

      //Handle errors when deleting a link
      request.onerror = (event) => {
        const error = new Error(
          `Error deleting link: ${(event.target as IDBRequest).error}`
        )
        setState((prevState) => ({
          ...prevState,
          status: 'error',
          error,
        }))
        reject(error)
      }
    })
  }

  const editLink = ( newValue: Link): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check if database is initialized
      if (!db) {
        const error = new Error('Database not initialized')
        setState((prevState) => ({ ...prevState, error, status: 'error' }))
        reject(error)
        return
      }

      // Create transaction to edit the link
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(newValue)

      request.onsuccess = () => {
        const index = state.data.findIndex((link) => link.id === newValue.id)
        setState((prevState) => {
          const data = [...prevState.data]
          data[index] = newValue
          return {
            status: 'success',
            data,
            error: null,
          }
        })

        resolve(newValue.id ?? '')
      }

      request.onerror = (event) => {
        console.log('nooo')
        const error = new Error(
          `Error editing link: ${(event.target as IDBRequest).error}`
        )
        setState((prevState) => ({
          ...prevState,
          status: 'error',
          error,
        }))
        reject(error)
      }
    })
  }

  // Return state values and methods
  return {
    status: state.status,
    links: state.data,
    error: state.error,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    addLink,
    refreshLinks,
    deleteLink,
    editLink
  }
}
