import { neon } from '@neondatabase/serverless';
import type { Product, Customer, Order, StoreSettings } from '../src/types/index.ts';

const getSql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL belum diisi di Environment Variables Vercel');
  return neon(url);
};

const j = (v: unknown) => JSON.stringify(v);

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
];

export class ServerDatabase {
  private ready: Promise<void> | null = null;

  private async db() {
    if (!this.ready) {
      this.ready = this.setup().catch(err => {
        this.ready = null;
        throw err;
      });
    }
    await this.ready;
    return getSql();
  }

  private async setup(): Promise<void> {
    const sql = getSql();
    await Promise.all([
      sql`CREATE TABLE IF NOT EXISTS app_products (seq BIGSERIAL, id TEXT PRIMARY KEY, data JSONB NOT NULL)`,
      sql`CREATE TABLE IF NOT EXISTS app_customers (seq BIGSERIAL, id TEXT PRIMARY KEY, data JSONB NOT NULL)`,
      sql`CREATE TABLE IF NOT EXISTS app_orders (seq BIGSERIAL, id TEXT PRIMARY KEY, data JSONB NOT NULL)`,
      sql`CREATE TABLE IF NOT EXISTS app_settings (id INT PRIMARY KEY, data JSONB NOT NULL)`,
    ]);

    const existing = await sql`SELECT id FROM app_settings WHERE id = 1`;
    if (existing.length > 0) return;

    // Isi data awal hanya sekali (database masih kosong)
    await sql`INSERT INTO app_settings (id, data) VALUES (1, ${j(DEFAULT_SETTINGS)}::jsonb) ON CONFLICT (id) DO NOTHING`;
    for (const p of DEFAULT_PRODUCTS) {
      await sql`INSERT INTO app_products (id, data) VALUES (${p.id}, ${j(p)}::jsonb) ON CONFLICT (id) DO NOTHING`;
    }
    for (const c of DEFAULT_CUSTOMERS) {
      await sql`INSERT INTO app_customers (id, data) VALUES (${c.id}, ${j(c)}::jsonb) ON CONFLICT (id) DO NOTHING`;
    }
    for (const o of DEFAULT_ORDERS) {
      await sql`INSERT INTO app_orders (id, data) VALUES (${o.id}, ${j(o)}::jsonb) ON CONFLICT (id) DO NOTHING`;
    }
  }

  // -------------------------
  // Products
  // -------------------------
  private async saveProduct(p: Product): Promise<void> {
    const sql = await this.db();
    await sql`UPDATE app_products SET data = ${j(p)}::jsonb WHERE id = ${p.id}`;
  }

  public async getProducts(): Promise<Product[]> {
    const sql = await this.db();
    const r = await sql`SELECT data FROM app_products ORDER BY seq ASC`;
    return r.map(x => x.data as Product);
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    const sql = await this.db();
    const r = await sql`SELECT data FROM app_products WHERE id = ${id}`;
    return r[0]?.data as Product | undefined;
  }

  public async createProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const sql = await this.db();
    const newProduct: Product = {
      ...product,
      id: product.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isActive: product.isActive !== undefined ? product.isActive : true,
    };
    await sql`INSERT INTO app_products (id, data) VALUES (${newProduct.id}, ${j(newProduct)}::jsonb)`;
    return newProduct;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const current = await this.getProductById(id);
    if (!current) return null;
    const next = { ...current, ...updates, id };
    await this.saveProduct(next);
    return next;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const sql = await this.db();
    const r = await sql`DELETE FROM app_products WHERE id = ${id} RETURNING id`;
    return r.length > 0;
  }

  // -------------------------
  // Customers (Automatic CRM)
  // -------------------------
  private async saveCustomer(c: Customer): Promise<void> {
    const sql = await this.db();
    await sql`UPDATE app_customers SET data = ${j(c)}::jsonb WHERE id = ${c.id}`;
  }

  public async getCustomers(): Promise<Customer[]> {
    const sql = await this.db();
    const r = await sql`SELECT data FROM app_customers ORDER BY seq DESC`;
    return r.map(x => x.data as Customer);
  }

  public async getCustomerById(id: string): Promise<Customer | undefined> {
    const sql = await this.db();
    const r = await sql`SELECT data FROM app_customers WHERE id = ${id}`;
    return r[0]?.data as Customer | undefined;
  }

  public async createCustomer(cust: Omit<Customer, 'id'> & { id?: string }): Promise<Customer> {
    const sql = await this.db();
    const newCust: Customer = {
      ...cust,
      id: cust.id || `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      firstVisit: cust.firstVisit || new Date().toISOString(),
      lastVisit: cust.lastVisit || new Date().toISOString(),
      totalSpent: cust.totalSpent || 0,
      ordersCount: cust.ordersCount || 0,
    };
    await sql`INSERT INTO app_customers (id, data) VALUES (${newCust.id}, ${j(newCust)}::jsonb)`;
    return newCust;
  }

  public async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    const current = await this.getCustomerById(id);
    if (!current) return null;
    const next = { ...current, ...updates, id };
    await this.saveCustomer(next);
    return next;
  }

  public async recordCustomerFromOrder(name: string, phone: string, total: number): Promise<Customer> {
    const sql = await this.db();
    const cleanPhone = phone.replace(/[^0-9+]/g, '').trim();
    const cleanName = name.trim() || 'Pelanggan Umum';
    const nowIso = new Date().toISOString();
    const customers = await this.getCustomers();

    let existing: Customer | undefined;
    if (cleanPhone) {
      existing = customers.find(c => (c.phone || '').replace(/[^0-9+]/g, '') === cleanPhone);
    }
    if (!existing && cleanName !== 'Pelanggan Umum') {
      existing = customers.find(c => c.name.toLowerCase() === cleanName.toLowerCase());
    }

    if (existing) {
      existing.totalSpent = (existing.totalSpent || 0) + total;
      existing.ordersCount = (existing.ordersCount || 0) + 1;
      existing.lastVisit = nowIso;
      if (cleanName !== 'Pelanggan Umum' && (!existing.name || existing.name === 'Pelanggan Umum')) {
        existing.name = cleanName;
      }
      if (cleanPhone && !existing.phone) existing.phone = cleanPhone;
      await this.saveCustomer(existing);
      return existing;
    }

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
    await sql`INSERT INTO app_customers (id, data) VALUES (${newCust.id}, ${j(newCust)}::jsonb)`;
    return newCust;
  }

  // -------------------------
  // Orders
  // -------------------------
  public async getOrders(): Promise<Order[]> {
    const sql = await this.db();
    const r = await sql`SELECT data FROM app_orders ORDER BY seq DESC`;
    return r.map(x => x.data as Order);
  }

  public async getOrderById(id: string): Promise<Order | undefined> {
    const sql = await this.db();
    const r = await sql`SELECT data FROM app_orders WHERE id = ${id}`;
    return r[0]?.data as Order | undefined;
  }

  public async createOrder(orderInput: Order): Promise<{ order: Order; customer: Customer }> {
    const sql = await this.db();

    // 1. Catat customer otomatis
    const customer = await this.recordCustomerFromOrder(
      orderInput.customerName,
      orderInput.customerPhone || '',
      orderInput.total
    );

    // 2. Potong stok
    for (const item of orderInput.items) {
      const prod = await this.getProductById(item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        await this.saveProduct(prod);
      }
    }

    // 3. Simpan order
    const finalizedOrder: Order = {
      ...orderInput,
      customerId: customer.id,
      createdAt: orderInput.createdAt || new Date().toISOString(),
    };
    await sql`INSERT INTO app_orders (id, data) VALUES (${finalizedOrder.id}, ${j(finalizedOrder)}::jsonb)`;

    return { order: finalizedOrder, customer };
  }

  public async updateOrder(
    id: string,
    updates: Partial<
      Pick<Order, 'customerName' | 'customerPhone' | 'paymentMethod' | 'items' | 'discount' | 'tax' | 'notes'>
    >
  ): Promise<Order | null> {
    const sql = await this.db();
    const current = await this.getOrderById(id);
    if (!current) return null;

    const next: Order = { ...current };

    if (updates.customerName !== undefined && updates.customerName.trim()) {
      next.customerName = updates.customerName.trim();
    }
    if (updates.customerPhone !== undefined) next.customerPhone = updates.customerPhone.trim();
    if (updates.paymentMethod !== undefined) next.paymentMethod = updates.paymentMethod;
    if (updates.notes !== undefined) next.notes = updates.notes;

    if (updates.items !== undefined) {
      if (updates.items.length === 0) throw new Error('Invoice minimal harus punya 1 item.');

      // Hitung selisih stok per produk, hanya yang berubah yang diproses
      const delta = new Map<string, number>();
      for (const it of current.items) {
        delta.set(it.productId, (delta.get(it.productId) || 0) + it.quantity);
      }
      for (const it of updates.items) {
        delta.set(it.productId, (delta.get(it.productId) || 0) - it.quantity);
      }
      await Promise.all(
        [...delta.entries()]
          .filter(([, d]) => d !== 0)
          .map(async ([productId, d]) => {
            const prod = await this.getProductById(productId);
            if (prod) {
              prod.stock = Math.max(0, prod.stock + d);
              await this.saveProduct(prod);
            }
          })
      );

      // Subtotal dihitung ulang di server
      next.items = updates.items.map(it => ({
        ...it,
        subtotal:
          (Number(it.price) || 0) *
          (Number(it.quantity) || 0) *
          (it.area ? Number(it.area) : 1),
      }));
    }

    next.subtotal = next.items.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
    if (updates.discount !== undefined) next.discount = Math.max(0, Number(updates.discount) || 0);
    if (updates.tax !== undefined) next.tax = Math.max(0, Number(updates.tax) || 0);
    next.total = Math.max(0, next.subtotal - (next.discount || 0) + (next.tax || 0));

    if (next.cashGiven !== undefined && next.cashGiven !== null) {
      next.cashChange = Math.max(0, next.cashGiven - next.total);
    }

    // Selisih total masuk ke total belanja customer
    const diff = next.total - current.total;
    if (diff !== 0 && current.customerId) {
      const cust = await this.getCustomerById(current.customerId);
      if (cust) {
        cust.totalSpent = Math.max(0, (cust.totalSpent || 0) + diff);
        await this.saveCustomer(cust);
      }
    }

    await sql`UPDATE app_orders SET data = ${j(next)}::jsonb WHERE id = ${id}`;
    return next;
  }

  // -------------------------
  // Settings
  // -------------------------
  public async getSettings(): Promise<StoreSettings> {
    const sql = await this.db();
    const r = await sql`SELECT data FROM app_settings WHERE id = 1`;
    return { ...DEFAULT_SETTINGS, ...(r[0]?.data || {}), neonDatabaseUrl: '' };
  }

  public async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const sql = await this.db();
    const { neonDatabaseUrl, ...safe } = settings; // URL database tidak disimpan
    const current = await this.getSettings();
    const next: StoreSettings = { ...current, ...safe };
    await sql`INSERT INTO app_settings (id, data) VALUES (1, ${j(next)}::jsonb)
              ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
    return next;
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
      const allProducts = await this.getProducts();
      const allCustomers = await this.getCustomers();

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
      for (const p of allProducts) {
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
      for (const c of allCustomers) {
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
