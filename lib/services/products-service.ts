import { fileStorage } from "../file-storage";

export const productsService = {
  async getProducts() {
    const { data } = await fileStorage.fetchCollection("products");
    return { data: data || [], error: null };
  },

  async getCategories() {
    const { data } = await fileStorage.fetchCollection("categories");
    return { data: data || [], error: null };
  },

  async createProduct(product: any) {
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_active: true,
    };
    const { data: savedProduct } = await fileStorage.saveItem(
      "products",
      newProduct
    );
    return { data: savedProduct || newProduct, error: null };
  },

  async updateProduct(id: string, updates: any) {
    const { data } = await fileStorage.updateItem("products", id, updates);
    return { data, error: null };
  },

  async deleteProduct(id: string) {
    return fileStorage.deleteItem("products", id);
  },
};
