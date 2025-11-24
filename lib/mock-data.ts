export const MOCK_USERS = [
  {
    id: "user-1",
    email: "admin@example.com",
    full_name: "Admin User",
    role: "admin",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "user-2",
    email: "cashier@example.com",
    full_name: "Jane Cashier",
    role: "cashier",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "user-3",
    email: "buttraheel6@gmail.com",
    full_name: "Raheel Butt",
    role: "admin",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Electronics" },
  { id: "cat-2", name: "Clothing" },
  { id: "cat-3", name: "Groceries" },
  { id: "cat-4", name: "Home & Garden" },
];

export const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Wireless Headphones",
    sku: "WH-001",
    category_id: "cat-1",
    price: 99.99,
    cost: 45.0,
    stock_quantity: 15,
    low_stock_threshold: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Cotton T-Shirt",
    sku: "TS-002",
    category_id: "cat-2",
    price: 19.99,
    cost: 5.5,
    stock_quantity: 50,
    low_stock_threshold: 10,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Organic Coffee Beans",
    sku: "CB-003",
    category_id: "cat-3",
    price: 14.5,
    cost: 8.0,
    stock_quantity: 3,
    low_stock_threshold: 10,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Smart Watch",
    sku: "SW-004",
    category_id: "cat-1",
    price: 199.99,
    cost: 120.0,
    stock_quantity: 8,
    low_stock_threshold: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_EXPENSE_CATEGORIES = [
  { id: "exp-cat-1", name: "Rent" },
  { id: "exp-cat-2", name: "Utilities" },
  { id: "exp-cat-3", name: "Supplies" },
  { id: "exp-cat-4", name: "Salaries" },
];

export const MOCK_EXPENSES = [
  {
    id: "exp-1",
    description: "Office Rent - January",
    amount: 1500.0,
    category_id: "exp-cat-1",
    expense_date: new Date(
      new Date().setDate(new Date().getDate() - 10)
    ).toISOString(),
    payment_method: "bank_transfer",
    notes: "Monthly rent payment",
    created_at: new Date().toISOString(),
  },
  {
    id: "exp-2",
    description: "Electricity Bill",
    amount: 245.5,
    category_id: "exp-cat-2",
    expense_date: new Date(
      new Date().setDate(new Date().getDate() - 5)
    ).toISOString(),
    payment_method: "card",
    notes: null,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_EMPLOYEES = [
  {
    id: "emp-1",
    employee_number: "EMP-001",
    profile_id: "user-2",
    position: "Senior Cashier",
    salary_type: "monthly",
    salary_amount: 3500.0,
    hire_date: "2024-01-15",
    employment_status: "active",
  },
];

export const MOCK_SALES = [
  {
    id: "sale-1",
    sale_number: "SALE-1001",
    cashier_id: "user-2",
    subtotal: 119.98,
    tax: 11.99,
    total: 131.97,
    payment_method: "card",
    payment_status: "completed",
    created_at: new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toISOString(),
  },
];
