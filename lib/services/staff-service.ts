import { fileStorage } from "../file-storage"
import { inMemoryStorage } from "../in-memory-storage"
import { MOCK_USERS, MOCK_EMPLOYEES } from "../mock-data"

export const staffService = {
  async getEmployees() {
    let employees = inMemoryStorage.get("employees")
    if (!employees || employees.length === 0) {
      inMemoryStorage.set("employees", MOCK_EMPLOYEES)
      employees = MOCK_EMPLOYEES
    }

    const { data } = await fileStorage.fetchCollection("employees")
    return { data: data && data.length > 0 ? data : employees, error: null }
  },

  async getProfiles() {
    let users = inMemoryStorage.get("users")
    if (!users || users.length === 0) {
      inMemoryStorage.set("users", MOCK_USERS)
      users = MOCK_USERS
    }

    const { data } = await fileStorage.fetchCollection("users")
    return { data: data && data.length > 0 ? data : users, error: null }
  },

  async createEmployee(employeeData: any) {
    const newEmployee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    const result = await fileStorage.saveItem("employees", newEmployee)
    if (result.error) {
      console.error("[v0] Failed to save employee:", result.error)
      // Still return the new employee even if persistence fails
      return { data: newEmployee, error: null }
    }
    return { data: result.data || newEmployee, error: null }
  },
}
