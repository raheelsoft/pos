import { inMemoryStorage } from "./in-memory-storage"

// File-based storage utility for persisting data
export const fileStorage = {
  async fetchCollection(collection: string) {
    try {
      const inMemoryData = inMemoryStorage.get(collection)
      if (inMemoryData && inMemoryData.length > 0) {
        return { data: inMemoryData, error: null }
      }

      try {
        const response = await fetch(`/api/storage/${collection}`, {
          method: "GET",
        })
        if (response.ok) {
          const data = await response.json()
          // Cache in memory
          if (Array.isArray(data) && data.length > 0) {
            inMemoryStorage.set(collection, data)
          }
          return { data: Array.isArray(data) ? data : [], error: null }
        }
      } catch (fetchError) {
        // Silent fail for API call
      }

      // Return in-memory data or empty array as fallback
      return { data: inMemoryStorage.get(collection) || [], error: null }
    } catch (error) {
      console.error(`[v0] Error fetching ${collection}:`, error)
      // Always return empty array instead of error
      return { data: [], error: null }
    }
  },

  async saveItem(collection: string, item: any) {
    try {
      const savedItem = inMemoryStorage.addItem(collection, item)

      // Try to persist to API in background (non-blocking)
      fetch(`/api/storage/${collection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }).catch((err) => console.error(`[v0] Background save failed:`, err))

      return { data: savedItem, error: null }
    } catch (error) {
      console.error(`[v0] Error saving to ${collection}:`, error)
      return { data: null, error }
    }
  },

  async updateItem(collection: string, id: string, updates: any) {
    try {
      const updatedItem = inMemoryStorage.updateItem(collection, id, updates)

      if (!updatedItem) {
        return { data: null, error: new Error("Item not found") }
      }

      // Try to persist to API in background (non-blocking)
      fetch(`/api/storage/${collection}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).catch((err) => console.error(`[v0] Background update failed:`, err))

      return { data: updatedItem, error: null }
    } catch (error) {
      console.error(`[v0] Error updating ${collection}:`, error)
      return { data: null, error }
    }
  },

  async deleteItem(collection: string, id: string) {
    try {
      const deleted = inMemoryStorage.deleteItem(collection, id)

      if (!deleted) {
        return { error: new Error("Item not found") }
      }

      // Try to persist to API in background (non-blocking)
      fetch(`/api/storage/${collection}/${id}`, {
        method: "DELETE",
      }).catch((err) => console.error(`[v0] Background delete failed:`, err))

      return { error: null }
    } catch (error) {
      console.error(`[v0] Error deleting from ${collection}:`, error)
      return { error }
    }
  },
}
