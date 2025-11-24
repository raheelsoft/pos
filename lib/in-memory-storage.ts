// In-memory storage to handle data persistence without filesystem access
import {
  MOCK_CATEGORIES,
  MOCK_EMPLOYEES,
  MOCK_EXPENSE_CATEGORIES,
  MOCK_EXPENSES,
  MOCK_PRODUCTS,
  MOCK_SALES,
  MOCK_USERS,
} from "./mock-data";

interface StorageData {
  [key: string]: any[];
}

// Initialize storage with mock data
const storage: StorageData = {
  users: [...MOCK_USERS],
  categories: [...MOCK_CATEGORIES],
  products: [...MOCK_PRODUCTS],
  expense_categories: [...MOCK_EXPENSE_CATEGORIES],
  expenses: [...MOCK_EXPENSES],
  employees: [...MOCK_EMPLOYEES],
  sales: [...MOCK_SALES],
};

export const inMemoryStorage = {
  set(collection: string, data: any[]) {
    storage[collection] = data;
  },

  get(collection: string) {
    return storage[collection] || [];
  },

  addItem(collection: string, item: any) {
    if (!storage[collection]) {
      storage[collection] = [];
    }
    storage[collection].push(item);
    return item;
  },

  updateItem(collection: string, id: string, updates: any) {
    if (!storage[collection]) {
      storage[collection] = [];
    }
    const index = storage[collection].findIndex((item) => item.id === id);
    if (index !== -1) {
      storage[collection][index] = {
        ...storage[collection][index],
        ...updates,
      };
      return storage[collection][index];
    }
    return null;
  },

  deleteItem(collection: string, id: string) {
    if (!storage[collection]) {
      return false;
    }
    const index = storage[collection].findIndex((item) => item.id === id);
    if (index !== -1) {
      storage[collection].splice(index, 1);
      return true;
    }
    return false;
  },
};
