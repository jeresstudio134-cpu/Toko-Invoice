import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import type { Product, Customer, Order, StoreSettings } from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'KOMA MINIMAL STORE',
  tagline: 'Coffee & Daily Goods',
  address: 'Jl. Senopati No. 42, Jakarta Selatan',
  phone: '0812-8899-7722',
  receiptFooter: 'Terima kasih atas kunjungan Anda!\nBarang yang sudah dibeli tidak dapat ditukar.',
  paperWidth: '58mm',
  taxPercent: 11,
  enableTax: false,
  currency: 'IDR',
  qrisCodeText: '00020101021226590014ID.LINKAJA.WWW011893600911002234010202150000000000000005204581253033605802ID5914KOMA MINIMAL6007JAKARTA61051219062070703A01630454D1',
  cloudinaryCloudName: 'kios-minimalis',
  cloudinaryUploadPreset: 'ml_default',
  theme: 'light',
  adminPin: '1234',
  neonDatabaseUrl: process.env.DATABASE_URL || '',
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
];

interface DatabaseSchema {
  settings: StoreSettings;
  products: Product[];
  customers: Customer[];
  orders: Order[];
}

export class ServerDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          products: parsed.products || DEFAULT_PRODUCTS,
          customers: parsed.customers || DEFAULT_CUSTOMERS,
          orders: parsed.orders || DEFAULT_ORDERS,
        };
      }
    } catch (e) {
      console.error('Failed reading database file, using default seed:', e);
    }

    const initial: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      products: DEFAULT_PRODUCTS,
      customers: DEFAULT_CUSTOMERS,
      orders: DEFAULT_ORDERS,
    };
    this.persist(initial);
    return initial;
  }

  private persist(data?: DatabaseSchema): void {
    const toSave = data || this.data;
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed saving database file:', e);
    }
  }

  // -------------------------
  // Products
  // -------------------------
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(product: Omit<Product, 'id'> & { id?: string }): Product {
    const newProduct: Product = {
      ...product,
      id: product.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isActive: product.isActive !== undefined ? product.isActive : true,
    };
    this.data.products.push(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.persist();
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const initLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // -------------------------
  // Customers (Automatic CRM)
  // -------------------------
  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.data.customers.find(c => c.id === id);
  }

  public createCustomer(cust: Omit<Customer, 'id'> & { id?: string }): Customer {
    const newCust: Customer = {
      ...cust,
      id: cust.id || `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      firstVisit: cust.firstVisit || new Date().toISOString(),
      lastVisit: cust.lastVisit || new Date().toISOString(),
      totalSpent: cust.totalSpent || 0,
      ordersCount: cust.ordersCount || 0,
    };
    this.data.customers.unshift(newCust);
    this.persist();
    return newCust;
  }

  public updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const index = this.data.customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.customers[index] = { ...this.data.customers[index], ...updates };
    this.persist();
    return this.data.customers[index];
  }

  public recordCustomerFromOrder(name: string, phone: string, total: number): Customer {
    const cleanPhone = phone.replace(/[^0-9+]/g, '').trim();
    const cleanName = name.trim() || 'Pelanggan Umum';
    const nowIso = new Date().toISOString();

    let existingIndex = -1;
    if (cleanPhone) {
      existingIndex = this.data.customers.findIndex(
        c => c.phone.replace(/[^0-9+]/g, '') === cleanPhone
      );
    }
    if (existingIndex === -1 && cleanName && cleanName !== 'Pelanggan Umum') {
      existingIndex = this.data.customers.findIndex(
        c => c.name.toLowerCase() === cleanName.toLowerCase()
      );
    }

    if (existingIndex >= 0) {
      const existing = this.data.customers[existingIndex];
      existing.totalSpent = (existing.totalSpent || 0) + total;
      existing.ordersCount = (existing.ordersCount || 0) + 1;
      existing.lastVisit = nowIso;
      if (cleanName && cleanName !== 'Pelanggan Umum' && (!existing.name || existing.name === 'Pelanggan Umum')) {
        existing.name = cleanName;
      }
      if (cleanPhone && !existing.phone) {
        existing.phone = cleanPhone;
      }
      this.data.customers[existingIndex] = existing;
      this.persist();
      return existing;
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: cleanName,
        phone: cleanPhone || '',
        totalSpent: total,
        ordersCount: 1,
        firstVisit: nowIso,
        lastVisit: nowIso,
        notes: 'Pencatatan otomatis dari pesanan kasir',
      };
      this.data.customers.unshift(newCust);
      this.persist();
      return newCust;
    }
  }

  // -------------------------
  // Orders
  // -------------------------
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public createOrder(orderInput: Order): { order: Order; customer: Customer } {
    // 1. Record customer automatically
    const customer = this.recordCustomerFromOrder(
      orderInput.customerName,
      orderInput.customerPhone || '',
      orderInput.total
    );

    // 2. Deduct product stock
    orderInput.items.forEach(item => {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    // 3. Attach customer ID & finalize order
    const finalizedOrder: Order = {
      ...orderInput,
      customerId: customer.id,
      createdAt: orderInput.createdAt || new Date().toISOString(),
    };

    this.data.orders.unshift(finalizedOrder);
    this.persist();

    return { order: finalizedOrder, customer };
  }

  public updateOrder(
    id: string,
    updates: Partial<
      Pick<Order, 'customerName' | 'customerPhone' | 'paymentMethod' | 'items' | 'discount' | 'tax' | 'notes'>
    >
  ): Order | null {
    const index = this.data.orders.findIndex(o => o.id === id);
    if (index === -1) return null;

    const current = this.data.orders[index];
    const next: Order = { ...current };

    if (updates.customerName !== undefined && updates.customerName.trim()) {
      next.customerName = updates.customerName.trim();
    }
    if (updates.customerPhone !== undefined) {
      next.customerPhone = updates.customerPhone.trim();
    }
    if (updates.paymentMethod !== undefined) {
      next.paymentMethod = updates.paymentMethod;
    }
    if (updates.notes !== undefined) {
      next.notes = updates.notes;
    }

    // Item berubah: sesuaikan stok & hitung ulang total
    if (updates.items !== undefined) {
      if (updates.items.length === 0) {
        throw new Error('Invoice minimal harus punya 1 item.');
      }

      // 1. Kembalikan stok dari item lama
      current.items.forEach(item => {
        const prod = this.data.products.find(p => p.id === item.productId);
        if (prod) prod.stock += item.quantity;
      });

      // 2. Potong stok sesuai item baru
      updates.items.forEach(item => {
        const prod = this.data.products.find(p => p.id === item.productId);
        if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
      });

      next.items = updates.items.map(it => ({
        ...it,
        subtotal:
          (Number(it.price) || 0) *
          (Number(it.quantity) || 0) *
          (it.area ? Number(it.area) : 1),
      }));
    }

    // Hitung ulang subtotal & total di server
    next.subtotal = next.items.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
    if (updates.discount !== undefined) next.discount = Math.max(0, Number(updates.discount) || 0);
    if (updates.tax !== undefined) next.tax = Math.max(0, Number(updates.tax) || 0);
    next.total = Math.max(0, next.subtotal - (next.discount || 0) + (next.tax || 0));

    // Kembalian tunai ikut menyesuaikan
    if (next.cashGiven !== undefined && next.cashGiven !== null) {
      next.cashChange = Math.max(0, next.cashGiven - next.total);
    }

    // Selisih total masuk ke total belanja customer
    const diff = next.total - current.total;
    if (diff !== 0 && current.customerId) {
      const cust = this.data.customers.find(c => c.id === current.customerId);
      if (cust) cust.totalSpent = Math.max(0, (cust.totalSpent || 0) + diff);
    }

    this.data.orders[index] = next;
    this.persist();
    return next;
  }

  // -------------------------
  // Settings
  // -------------------------
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.persist();
    return this.data.settings;
  }

  // -------------------------
  // Neon PostgreSQL Integration
  // -------------------------
  public async testNeonConnection(connectionString: string): Promise<{ success: boolean; message: string; timestamp?: string }> {
    try {
      if (!connectionString.trim()) {
        return { success: false, message: 'Connection string Neon tidak boleh kosong.' };
      }
      const sql = neon(connectionString);
      const rows = await sql`SELECT NOW() as current_time, version() as pg_version;`;
      return {
        success: true,
        message: 'Koneksi ke Neon PostgreSQL Berhasil!',
        timestamp: rows[0]?.current_time?.toString(),
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Gagal tersambung ke Neon PostgreSQL. Periksa URL koneksi Anda.',
      };
    }
  }

  public async syncToNeon(connectionString: string): Promise<{ success: boolean; message: string; rowsAffected?: number }> {
    try {
      const sql = neon(connectionString);

      // Create tables in Neon
      await sql`
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
      `;

      await sql`
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
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(64) PRIMARY KEY,
          invoice_number VARCHAR(100) UNIQUE NOT NULL,
          customer_id VARCHAR(64),
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
      `;

      // Upsert products to Neon
      for (const p of this.data.products) {
        await sql`
          INSERT INTO products (id, name, category, price, cost_price, stock, unit, sku, description, is_active)
          VALUES (${p.id}, ${p.name}, ${p.category}, ${p.price}, ${p.costPrice || 0}, ${p.stock}, ${p.unit}, ${p.sku || ''}, ${p.description || ''}, ${p.isActive})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            price = EXCLUDED.price,
            stock = EXCLUDED.stock;
        `;
      }

      // Upsert customers to Neon
      for (const c of this.data.customers) {
        await sql`
          INSERT INTO customers (id, name, phone, email, address, total_spent, orders_count, notes)
          VALUES (${c.id}, ${c.name}, ${c.phone || ''}, ${c.email || ''}, ${c.address || ''}, ${c.totalSpent}, ${c.ordersCount}, ${c.notes || ''})
          ON CONFLICT (id) DO UPDATE SET
            total_spent = EXCLUDED.total_spent,
            orders_count = EXCLUDED.orders_count;
        `;
      }

      return {
        success: true,
        message: 'Seluruh data produk dan customer berhasil disinkronkan ke Neon PostgreSQL!',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Gagal sinkronisasi data ke Neon PostgreSQL.',
      };
    }
  }
}

export const serverDb = new ServerDatabase();
