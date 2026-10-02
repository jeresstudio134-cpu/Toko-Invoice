import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { serverDb } from './server/db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

type Handler = (req: express.Request, res: express.Response) => Promise<any>;
const wrap =
  (fn: Handler): express.RequestHandler =>
  (req, res) => {
    Promise.resolve(fn(req, res)).catch((err: any) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
  };

// Parse CLOUDINARY_URL (e.g. cloudinary://api_key:api_secret@cloud_name)
function parseCloudinaryUrl(rawUrl?: string) {
  if (!rawUrl) return null;
  const clean = rawUrl.trim().replace(/^['"]|['"]$/g, '');
  const match = clean.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/\s?]+)/);
  if (match) {
    return {
      apiKey: match[1],
      apiSecret: match[2],
      cloudName: match[3],
    };
  }
  return null;
}

// Upload Foto Produk via Cloudinary
app.post('/api/upload', wrap(async (req, res) => {
  const { file } = req.body;
  if (!file) {
    return res.status(400).json({ error: 'Data file gambar tidak ditemukan.' });
  }

  // 1. Cek dari CLOUDINARY_URL (format resmi Cloudinary di Vercel / server)
  const cloudinaryUrl =
    process.env.CLOUDINARY_URL ||
    process.env.VITE_CLOUDINARY_URL;
  const creds = parseCloudinaryUrl(cloudinaryUrl);

  if (creds && creds.apiKey && creds.apiSecret && creds.cloudName) {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = crypto
      .createHash('sha1')
      .update(`timestamp=${timestamp}${creds.apiSecret}`)
      .digest('hex');

    const cRes = await fetch(`https://api.cloudinary.com/v1_1/${creds.cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file,
        api_key: creds.apiKey,
        timestamp,
        signature,
      }),
    });

    const data = await cRes.json();
    if (!cRes.ok || !data.secure_url) {
      throw new Error(data?.error?.message || 'Gagal mengunggah foto ke Cloudinary.');
    }
    return res.json({ secure_url: data.secure_url, url: data.url });
  }

  // 2. Alternatif jika memakai CLOUDINARY_CLOUD_NAME + UPLOAD_PRESET
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET ||
    process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file,
        upload_preset: uploadPreset,
      }),
    });
    const data = await cRes.json();
    if (!cRes.ok || !data.secure_url) {
      throw new Error(data?.error?.message || 'Gagal mengunggah foto ke Cloudinary.');
    }
    return res.json({ secure_url: data.secure_url, url: data.url });
  }

  return res.status(500).json({
    error:
      'CLOUDINARY_URL belum dikonfigurasi di Environment Variables server/Vercel.',
  });
}));

// Health check (sekalian cek koneksi database)
app.get('/api/health', async (req, res) => {
  try {
    await serverDb.getSettings();
    res.json({ status: 'ok', database: 'neon', timestamp: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ status: 'error', database: 'neon', error: err.message });
  }
});

// Products
app.get('/api/products', wrap(async (req, res) => {
  res.json(await serverDb.getProducts());
}));

app.post('/api/products', wrap(async (req, res) => {
  res.status(201).json(await serverDb.createProduct(req.body));
}));

app.put('/api/products/:id', wrap(async (req, res) => {
  const updated = await serverDb.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json(updated);
}));

app.delete('/api/products/:id', wrap(async (req, res) => {
  res.json({ success: await serverDb.deleteProduct(req.params.id) });
}));

// Customers
app.get('/api/customers', wrap(async (req, res) => {
  res.json(await serverDb.getCustomers());
}));

app.post('/api/customers', wrap(async (req, res) => {
  res.status(201).json(await serverDb.createCustomer(req.body));
}));

app.put('/api/customers/:id', wrap(async (req, res) => {
  const updated = await serverDb.updateCustomer(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Customer not found' });
  res.json(updated);
}));

// Orders
app.get('/api/orders', wrap(async (req, res) => {
  res.json(await serverDb.getOrders());
}));

app.post('/api/orders', wrap(async (req, res) => {
  res.status(201).json(await serverDb.createOrder(req.body));
}));

app.put('/api/orders/:id', wrap(async (req, res) => {
  const { customerName, customerPhone, paymentMethod, items, discount, tax, notes } = req.body;
  const updated = await serverDb.updateOrder(req.params.id, {
    customerName,
    customerPhone,
    paymentMethod,
    items,
    discount,
    tax,
    notes,
  });
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
}));

app.delete('/api/orders/:id', wrap(async (req, res) => {
  const ok = await serverDb.deleteOrder(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Order not found' });
  res.json({ success: true });
}));

// Settings
app.get('/api/settings', wrap(async (req, res) => {
  res.json(await serverDb.getSettings());
}));

app.put('/api/settings', wrap(async (req, res) => {
  res.json(await serverDb.updateSettings(req.body));
}));

// Neon test & sync
app.post('/api/neon/test', async (req, res) => {
  try {
    res.json(await serverDb.testNeonConnection(req.body.url));
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/neon/sync', async (req, res) => {
  try {
    res.json(await serverDb.syncToNeon(req.body.url));
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Dev server lokal saja (di Vercel tidak dijalankan)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KiosMinimalis] Backend running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;