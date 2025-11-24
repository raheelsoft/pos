import { fileStorage } from "../file-storage"
import { MOCK_EXPENSES, MOCK_EXPENSE_CATEGORIES } from "../mock-data"

export const expensesService = {
  async getExpenses() {
    const { data } = await fileStorage.fetchCollection("expenses")
    return { data: data && data.length > 0 ? data : MOCK_EXPENSES, error: null }
  },

  async getCategories() {
    const { data } = await fileStorage.fetchCollection("expense_categories")
    return { data: data && data.length > 0 ? data : MOCK_EXPENSE_CATEGORIES, error: null }
  },

  async createExpense(expense: any) {
    const newExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    const { data: savedExpense } = await fileStorage.saveItem("expenses", newExpense)
    return { data: savedExpense || newExpense, error: null }
  },

  async deleteExpense(id: string) {
    return fileStorage.deleteItem("expenses", id)
  },
}
