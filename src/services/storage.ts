import { Product, Customer, Order, StoreSettings } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'kios_minimalis_products_v1',
  CUSTOMERS: 'kios_minimalis_customers_v1',
  ORDERS: 'kios_minimalis_orders_v1',
  SETTINGS: 'kios_minimalis_settings_v1',
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'JERES STUDIO',
  tagline: 'Toko & Kasir HP',
  address: 'Jl. Senopati No. 42, Jakarta Selatan',
  phone: '0812-8899-7722',
  receiptFooter: 'Terima kasih atas kunjungan Anda!\nBarang yang sudah dibeli tidak dapat ditukar.',
  paperWidth: '58mm',
  taxPercent: 11,
  enableTax: false,
  currency: 'IDR',
  qrisCodeText: '00020101021226590014ID.LINKAJA.WWW011893600911002234010202150000000000000005204581253033605802ID5914JERES STUDIO6007JAKARTA61051219062070703A01630454D1',
  qrisImageUrl: '',
  cloudinaryCloudName: 'kios-minimalis',
  cloudinaryUploadPreset: 'ml_default',
  theme: 'light',
  adminPin: '1234',
  neonDatabaseUrl: '',
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kopi Susu Aren Special',
    category: 'Minuman',
    price: 22000,
    costPrice: 9500,
    stock: 45,
    unit: 'cup',
    sku: 'DRK-001',
    description: 'Espresso double shot, susu segar, gula aren organik lokal',
    isActive: true,
  },
  {
    id: 'prod-2',
    name: 'Matcha Latte Uji',
    category: 'Minuman',
    price: 28000,
    costPrice: 12000,
    stock: 32,
    unit: 'cup',
    sku: 'DRK-002',
    description: 'Matcha murni dari Uji Jepang dengan susu oat pilihan',
    isActive: true,
  },
  {
    id: 'prod-3',
    name: 'Cold Brew Citrus Black',
    category: 'Minuman',
    price: 25000,
    costPrice: 10000,
    stock: 20,
    unit: 'botol',
    sku: 'DRK-003',
    description: 'Steeped 16 jam dengan hint citrus segar',
    isActive: true,
  },
  {
    id: 'prod-4',
    name: 'Almond Butter Croissant',
    category: 'Pastry',
    price: 26000,
    costPrice: 13000,
    stock: 18,
    unit: 'pcs',
    sku: 'PST-001',
    description: 'Flaky French butter pastry dengan roasted almond flakes',
    isActive: true,
  },
  {
    id: 'prod-5',
    name: 'Artisan Cinnamon Roll',
    category: 'Pastry',
    price: 24000,
    costPrice: 11000,
    stock: 15,
    unit: 'pcs',
    sku: 'PST-002',
    description: 'Cream cheese glaze lembut dengan kayu manis ceylon wangi',
    isActive: true,
  },
  {
    id: 'prod-6',
    name: 'Sourdough Toast & Kaya',
    category: 'Makanan',
    price: 28000,
    costPrice: 12500,
    stock: 24,
    unit: 'porsi',
    sku: 'FOD-001',
    description: 'Roti sourdough panggang dengan selai srikaya pandan & butter',
    isActive: true,
  },
  {
    id: 'prod-7',
    name: 'Linen Tote Bag Natural',
    category: 'Merchandise',
    price: 75000,
    costPrice: 38000,
    stock: 12,
    unit: 'pcs',
    sku: 'MCH-001',
    description: 'Tas kanvas katun organik 100% minimalis ramah lingkungan',
    isActive: true,
  },
  {
    id: 'prod-8',
    name: 'Ceramic Mug Off-White 250ml',
    category: 'Merchandise',
    price: 65000,
    costPrice: 30000,
    stock: 10,
    unit: 'pcs',
    sku: 'MCH-002',
    description: 'Cangkir keramik handmade matte texture',
    isActive: true,
  },
];

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Budi Santoso',
    phone: '081234567890',
    email: 'budi.santoso@email.com',
    address: 'Kebayoran Baru, Jakarta Selatan',
    totalSpent: 188000,
    ordersCount: 4,
    firstVisit: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastVisit: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: 'Suka kopi less sugar, pelanggan tetap',
  },
  {
    id: 'cust-2',
    name: 'Siti Rahma',
    phone: '085712345678',
    email: 'siti.rahma@email.com',
    address: 'Tebet Barat, Jakarta',
    totalSpent: 124000,
    ordersCount: 2,
    firstVisit: new Date(Date.now() - 8 * 86400000).toISOString(),
    lastVisit: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: 'Favorit: Matcha Latte Uji',
  },
  {
    id: 'cust-3',
    name: 'Dimas Wicaksono',
    phone: '081899887766',
    email: 'dimas.w@email.com',
    totalSpent: 75000,
    ordersCount: 1,
    firstVisit: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastVisit: new Date(Date.now() - 3 * 86400000).toISOString(),
    notes: 'Beli tote bag merchandise',
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-101',
    invoiceNumber: 'INV-20260928-001',
    customerId: 'cust-1',
    customerName: 'Budi Santoso',
    customerPhone: '081234567890',
    items: [
      { productId: 'prod-1', productName: 'Kopi Susu Aren Special', price: 22000, costPrice: 9500, quantity: 2, subtotal: 44000 },
      { productId: 'prod-4', productName: 'Almond Butter Croissant', price: 26000, costPrice: 13000, quantity: 1, subtotal: 26000 },
    ],
    subtotal: 70000,
    discount: 0,
    tax: 0,
    total: 70000,
    paymentMethod: 'qris',
    paymentStatus: 'lunas',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: 'Meja 03',
  },
  {
    id: 'ord-102',
    invoiceNumber: 'INV-20260929-002',
    customerId: 'cust-2',
    customerName: 'Siti Rahma',
    customerPhone: '085712345678',
    items: [
      { productId: 'prod-2', productName: 'Matcha Latte Uji', price: 28000, costPrice: 12000, quantity: 2, subtotal: 56000 },
      { productId: 'prod-5', productName: 'Artisan Cinnamon Roll', price: 24000, costPrice: 11000, quantity: 1, subtotal: 24000 },
    ],
    subtotal: 80000,
    discount: 5000,
    tax: 0,
    total: 75000,
    paymentMethod: 'tunai',
    paymentStatus: 'lunas',
    cashGiven: 100000,
    cashChange: 25000,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: 'Takeaway',
  },
  {
    id: 'ord-103',
    invoiceNumber: 'INV-20260930-003',
    customerId: 'cust-1',
    customerName: 'Budi Santoso',
    customerPhone: '081234567890',
    items: [
      { productId: 'prod-1', productName: 'Kopi Susu Aren Special', price: 22000, costPrice: 9500, quantity: 1, subtotal: 22000 },
      { productId: 'prod-6', productName: 'Sourdough Toast & Kaya', price: 28000, costPrice: 12500, quantity: 1, subtotal: 28000 },
    ],
    subtotal: 50000,
    discount: 0,
    tax: 0,
    total: 50000,
    paymentMethod: 'qris',
    paymentStatus: 'lunas',
    createdAt: new Date().toISOString(),
    notes: 'Sarapan pagi',
  },
];

export const StorageService = {
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
        return DEFAULT_CUSTOMERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_CUSTOMERS;
    }
  },

  saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
        return DEFAULT_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  getSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: StoreSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  /**
   * Fitur Pencatatan Customer Otomatis:
   * Setiap ada order dengan nama customer / nomor HP, sistem otomatis memperbarui
   * atau membuat data customer baru lengkap dengan frekuensi kunjungan dan total belanjanya.
   */
  recordCustomerAutomatically(name: string, phone: string, orderTotal: number): Customer {
    const cleanPhone = phone.replace(/[^0-9+]/g, '').trim();
    const cleanName = name.trim() || 'Pelanggan Umum';
    const customers = this.getCustomers();
    const nowIso = new Date().toISOString();

    let existingIndex = -1;
    if (cleanPhone) {
      existingIndex = customers.findIndex(c => c.phone.replace(/[^0-9+]/g, '') === cleanPhone);
    }
    if (existingIndex === -1 && cleanName && cleanName !== 'Pelanggan Umum') {
      existingIndex = customers.findIndex(c => c.name.toLowerCase() === cleanName.toLowerCase());
    }

    let customerResult: Customer;

    if (existingIndex >= 0) {
      // Update existing customer record
      const existing = customers[existingIndex];
      existing.totalSpent = (existing.totalSpent || 0) + orderTotal;
      existing.ordersCount = (existing.ordersCount || 0) + 1;
      existing.lastVisit = nowIso;
      if (cleanName && cleanName !== 'Pelanggan Umum' && (!existing.name || existing.name === 'Pelanggan Umum')) {
        existing.name = cleanName;
      }
      if (cleanPhone && !existing.phone) {
        existing.phone = cleanPhone;
      }
      customers[existingIndex] = existing;
      customerResult = existing;
    } else {
      // Create new customer record automatically
      const newCustomer: Customer = {
        id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: cleanName,
        phone: cleanPhone || '',
        totalSpent: orderTotal,
        ordersCount: 1,
        firstVisit: nowIso,
        lastVisit: nowIso,
        notes: 'Pencatatan otomatis dari pesanan kasir',
      };
      customers.unshift(newCustomer);
      customerResult = newCustomer;
    }

    this.saveCustomers(customers);
    return customerResult;
  },

  /**
   * Mengurangi stok produk secara otomatis setelah transaksi selesai
   */
  deductProductStock(items: { productId: string; quantity: number }[]): void {
    const products = this.getProducts();
    items.forEach(item => {
      const idx = products.findIndex(p => p.id === item.productId);
      if (idx >= 0) {
        products[idx].stock = Math.max(0, products[idx].stock - item.quantity);
      }
    });
    this.saveProducts(products);
  },

  generateInvoiceNumber(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const orders = this.getOrders();
    const todayCount = orders.filter(o => o.createdAt.startsWith(`${yyyy}-${mm}-${dd}`)).length + 1;
    const seq = String(todayCount).padStart(3, '0');
    return `INV-${yyyy}${mm}${dd}-${seq}`;
  },

  /**
   * Menghasilkan skrip SQL PostgreSQL lengkap yang siap di-run di Neon Database!
   * Memudahkan migrasi ke Vercel + Neon.
   */
  generateNeonPostgresSql(): string {
    const products = this.getProducts();
    const customers = this.getCustomers();
    const orders = this.getOrders();

    return `-- =========================================================
-- NEON POSTGRESQL SCHEMA & SEED SCRIPT
-- Generated by KiosMinimalis Store System
-- Siap dijalankan di Neon SQL Console (https://console.neon.tech)
-- =========================================================

-- 1. Tabel Produk / Menu (Cocok untuk Cloudinary Image URL)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    cost_price NUMERIC(12, 2) DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    unit VARCHAR(30) DEFAULT 'pcs',
    image_url TEXT,
    sku VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Customer (Pencatatan Otomatis)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    total_spent NUMERIC(14, 2) DEFAULT 0,
    orders_count INT DEFAULT 0,
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- 3. Tabel Pesanan / Nota (Orders)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0,
    tax NUMERIC(12, 2) DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'lunas',
    cash_given NUMERIC(12, 2),
    cash_change NUMERIC(12, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Detail Item Pesanan (Order Items)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    cost_price NUMERIC(12, 2) DEFAULT 0,
    quantity INT NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    note VARCHAR(255)
);

-- 5. SEED DATA DARI DATA TOKO SAAT INI:
-- Seed Customers
${customers.map(c => `INSERT INTO customers (id, name, phone, email, address, total_spent, orders_count, notes)
VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.phone || ''}', '${c.email || ''}', '${(c.address || '').replace(/'/g, "''")}', ${c.totalSpent}, ${c.ordersCount}, '${(c.notes || '').replace(/'/g, "''")}')
ON CONFLICT (id) DO UPDATE SET total_spent = EXCLUDED.total_spent, orders_count = EXCLUDED.orders_count;`).join('\n')}

-- Seed Products
${products.map(p => `INSERT INTO products (id, name, category, price, cost_price, stock, unit, sku, description, is_active)
VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${p.category}', ${p.price}, ${p.costPrice || 0}, ${p.stock}, '${p.unit}', '${p.sku || ''}', '${(p.description || '').replace(/'/g, "''")}', ${p.isActive})
ON CONFLICT (id) DO NOTHING;`).join('\n')}

-- SEED COMPLETE.
`;
  },
};
