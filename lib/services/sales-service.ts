import { fileStorage } from "../file-storage"
import { MOCK_SALES } from "../mock-data"

export const salesService = {
  async getSales(period?: string) {
    const { data } = await fileStorage.fetchCollection("sales")
    return { data: data && data.length > 0 ? data : MOCK_SALES, error: null }
  },

  async createSale(saleData: any, items: any[]) {
    const newSale = {
      ...saleData,
      id: `sale-${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    const { data: savedSale } = await fileStorage.saveItem("sales", newSale)
    return { data: savedSale || newSale, error: null }
  },
}
