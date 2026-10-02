import React, { useState } from 'react';
import { Product, Customer, Order, StoreSettings } from '../types';
import { ApiService } from '../services/api';
import { formatRupiah } from '../utils/format';
import {
  Store,
  Database,
  Cloud,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Save,
  Sun,
  Moon,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Download,
  AlertTriangle,
  RefreshCw,
  LogOut,
} from 'lucide-react';

interface SetelanViewProps {
  settings: StoreSettings;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  onUpdateSettings: (settings: StoreSettings) => void;
  onUpdateProducts: (products: Product[]) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
  onGoBackToKatalog?: () => void;
}

export const SetelanView: React.FC<SetelanViewProps> = ({
  settings,
  products,
  customers,
  orders,
  onUpdateSettings,
  onUpdateProducts,
  theme = 'light',
  onToggleTheme,
  isAdminAuthenticated,
  setIsAdminAuthenticated,
  onGoBackToKatalog,
}) => {
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState<'toko' | 'produk' | 'keamanan'>('toko');
  // Admin PIN input state for gate
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isSyncingNeon, setIsSyncingNeon] = useState(false);
  const [neonSyncNotice, setNeonSyncNotice] = useState<string | null>(null);

  // Form states for store settings
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>(settings.paperWidth);
  const [enableTax, setEnableTax] = useState(settings.enableTax);
  const [taxPercent, setTaxPercent] = useState(settings.taxPercent);
  const [cloudName, setCloudName] = useState(settings.cloudinaryCloudName || '');
  const [uploadPreset, setUploadPreset] = useState(settings.cloudinaryUploadPreset || '');
  const [neonDbUrl, setNeonDbUrl] = useState(settings.neonDatabaseUrl || '');

  // Change Admin PIN state
  const [currentPinAttempt, setCurrentPinAttempt] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinChangeMessage, setPinChangeMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Database Connection Test State
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<string | null>(null);

  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Product edit modal / form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // New/Edit product fields
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Minuman');
  const [pPrice, setPPrice] = useState<number>(20000);
  const [pCostPrice, setPCostPrice] = useState<number>(10000);
  const [pStock, setPStock] = useState<number>(25);
  const [pUnit, setPUnit] = useState('cup');
  const [pImageUrl, setPImageUrl] = useState('');
  const [pDescription, setPDescription] = useState('');

  const targetAdminPin = settings.adminPin || '1234';

  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.trim() === targetAdminPin) {
      setIsAdminAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pinInput.length < 6) {
      const next = pinInput + val;
      setPinInput(next);
      setPinError(false);
      if (next === targetAdminPin) {
        setIsAdminAuthenticated(true);
        setPinInput('');
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setPinError(false);
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoreSettings = {
      ...settings,
      storeName,
      tagline,
      address,
      phone,
      receiptFooter,
      paperWidth,
      enableTax,
      taxPercent,
      cloudinaryCloudName: cloudName,
      cloudinaryUploadPreset: uploadPreset,
      neonDatabaseUrl: neonDbUrl,
    };
    onUpdateSettings(updated);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2500);
  };

  const handleTestNeonConnection = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    try {
      const res = await ApiService.testNeonConnection(neonDbUrl);
      setIsTestingDb(false);
      if (res.success) {
        setDbTestResult(`Koneksi Sukses! Server terhubung ke Neon PostgreSQL (${res.timestamp || 'Live'})`);
      } else {
        setDbTestResult(`Hasil Tes: ${res.message}`);
      }
    } catch (err: any) {
      setIsTestingDb(false);
      setDbTestResult(`Gagal koneksi: ${err.message}`);
    }
  };

  const handleSyncNeon = async () => {
    if (!neonDbUrl.trim()) {
      alert('Harap isi DATABASE_URL Neon terlebih dahulu.');
      return;
    }
    setIsSyncingNeon(true);
    setNeonSyncNotice(null);
    try {
      const res = await ApiService.syncToNeon(neonDbUrl);
      setIsSyncingNeon(false);
      setNeonSyncNotice(res.message);
      setTimeout(() => setNeonSyncNotice(null), 4000);
    } catch (err: any) {
      setIsSyncingNeon(false);
      setNeonSyncNotice(`Gagal: ${err.message}`);
    }
  };

  const handleChangeAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinAttempt !== targetAdminPin) {
      setPinChangeMessage({ text: 'PIN Lama salah!', success: false });
      return;
    }
    if (newPin.length < 4) {
      setPinChangeMessage({ text: 'PIN Baru minimal 4 karakter!', success: false });
      return;
    }
    if (newPin !== confirmNewPin) {
      setPinChangeMessage({ text: 'Konfirmasi PIN Baru tidak cocok!', success: false });
      return;
    }

    const updated: StoreSettings = {
      ...settings,
      adminPin: newPin,
    };
    onUpdateSettings(updated);
    setPinChangeMessage({ text: 'PIN Admin berhasil diubah!', success: true });
    setCurrentPinAttempt('');
    setNewPin('');
    setConfirmNewPin('');
    setTimeout(() => setPinChangeMessage(null), 3000);
  };

  const handleCopyNeonSql = async () => {
    const sql = ApiService.generateNeonPostgresSql(products, customers);
    try {
      await navigator.clipboard.writeText(sql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      // fallback
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setPName('');
    setPCategory('Minuman');
    setPPrice(20000);
    setPCostPrice(10000);
    setPStock(30);
    setPUnit('pcs');
    setPImageUrl('');
    setPDescription('');
    setShowProductModal(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPCostPrice(prod.costPrice || 0);
    setPStock(prod.stock);
    setPUnit(prod.unit);
    setPImageUrl(prod.imageUrl || '');
    setPDescription(prod.description || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    if (editingProduct) {
      const updatedList = products.map(p =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: pName.trim(),
              category: pCategory.trim(),
              price: Number(pPrice) || 0,
              costPrice: Number(pCostPrice) || 0,
              stock: Number(pStock) || 0,
              unit: pUnit.trim() || 'pcs',
              imageUrl: pImageUrl.trim() || undefined,
              description: pDescription.trim() || undefined,
            }
          : p
      );
      onUpdateProducts(updatedList);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: pName.trim(),
        category: pCategory.trim() || 'Umum',
        price: Number(pPrice) || 0,
        costPrice: Number(pCostPrice) || 0,
        stock: Number(pStock) || 0,
        unit: pUnit.trim() || 'pcs',
        imageUrl: pImageUrl.trim() || undefined,
        description: pDescription.trim() || undefined,
        isActive: true,
      };
      onUpdateProducts([...products, newProd]);
    }

    setShowProductModal(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Yakin ingin menghapus produk ini dari katalog?')) {
      const updatedList = products.filter(p => p.id !== productId);
      onUpdateProducts(updatedList);
    }
  };

  const handleBackupJson = () => {
    const backupData = {
      store: settings,
      products,
      customers,
      orders,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_kios_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // VIEW: ADMIN AUTHENTICATION GATE (When NOT authenticated)
  // -------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="pb-28 px-4 pt-6 max-w-sm mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div
            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border shadow-xs ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-amber-400'
                : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <ShieldCheck className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Akses Admin Database & Pengaturan
          </h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            Halaman ini khusus pemilik toko/admin untuk konfigurasi toko, menu, dan keamanan.
          </p>
        </div>

        {/* PIN Entry Box */}
        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-center items-center gap-2.5 my-3">
              {[0, 1, 2, 3].map(idx => {
                const filled = pinInput.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      filled
                        ? isDark
                          ? 'bg-white border-white scale-110'
                          : 'bg-neutral-900 border-neutral-900 scale-110'
                        : isDark
                        ? 'border-neutral-700 bg-neutral-850'
                        : 'border-neutral-300 bg-neutral-100'
                    }`}
                  />
                );
              })}
            </div>

            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={e => {
                setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                setPinError(false);
              }}
              placeholder="Ketik 4-digit PIN Admin"
              className={`w-full text-center tracking-widest text-base font-mono font-bold p-3 rounded-xl border outline-none transition-all ${
                pinError
                  ? 'border-red-500 bg-red-50/10 text-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-neutral-900 text-white border-neutral-800 focus:border-neutral-600'
                  : 'bg-white text-neutral-900 border-neutral-200 focus:border-neutral-900 shadow-xs'
              }`}
            />

            {pinError && (
              <p className="text-xs text-red-500 text-center font-medium">
                PIN Admin salah! Silakan coba lagi.
              </p>
            )}

            <div className="text-center pt-1">
              <span className="text-[11px] text-neutral-400 bg-neutral-100 dark:bg-neutral-850 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
                PIN Bawaan Admin: <strong className="font-mono text-neutral-800 dark:text-neutral-200">{targetAdminPin}</strong>
              </span>
            </div>
          </div>

          {/* Clean Tactile Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className={`py-3.5 rounded-xl font-bold font-mono text-sm active:scale-95 transition-all border ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-850'
                    : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-100 shadow-xs'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className={`py-3.5 rounded-xl text-xs font-semibold active:scale-95 transition-all border ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className={`py-3.5 rounded-xl font-bold font-mono text-sm active:scale-95 transition-all border ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-neutral-850'
                  : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-100 shadow-xs'
              }`}
            >
              0
            </button>
            <button
              type="submit"
              className={`py-3.5 rounded-xl font-bold text-xs active:scale-95 transition-all shadow-sm ${
                isDark
                  ? 'bg-white text-neutral-950 hover:bg-neutral-200'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              Masuk
            </button>
          </div>

          {onGoBackToKatalog && (
            <button
              type="button"
              onClick={onGoBackToKatalog}
              className="w-full text-center text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white py-2"
            >
              ← Kembali ke Menu Toko
            </button>
          )}
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: FULL ADMIN SETTINGS & DATABASE CONFIGURATION (UNLOCKED)
  // -------------------------------------------------------------
  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4">
      {/* Top Admin Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Pengaturan Admin
            </h2>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <Unlock className="w-3 h-3" />
              <span>Admin Aktif</span>
            </span>
          </div>
          <p className="text-[11px] text-neutral-500">Konfigurasi toko & sistem</p>
        </div>

        {/* Lock / Logout Admin Button */}
        <button
          onClick={() => setIsAdminAuthenticated(false)}
          title="Kunci Mode Admin"
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl border active:scale-95 transition-all ${
            isDark
              ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
              : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100 shadow-xs'
          }`}
        >
          <LogOut className="w-3.5 h-3.5 text-red-500" />
          <span>Kunci</span>
        </button>
      </div>

      {/* Nav Sub-Tabs for Admin Sections */}
      <div
        className={`grid grid-cols-3 gap-1 p-1 rounded-xl border text-xs ${
          isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
        }`}
      >
        
        <button
          onClick={() => setActiveSection('toko')}
          className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${
            activeSection === 'toko'
              ? isDark
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Profil Toko
        </button>
        <button
          onClick={() => setActiveSection('produk')}
          className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${
            activeSection === 'produk'
              ? isDark
                ? 'bg-white text-neutral-950 shadow-xs'
                : 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Menu & Modal
        </button>
        <button
          onClick={() => setActiveSection('keamanan')}
          className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${
            activeSection === 'keamanan'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-neutral-500 hover:text-amber-600'
          }`}
        >
          Keamanan
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION: NEON DATABASE POSTGRESQL                             */}
      {/* ------------------------------------------------------------- */}

      {/* ------------------------------------------------------------- */}
      {/* SECTION: PROFIL TOKO & TEMA                                   */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'toko' && (
        <form onSubmit={handleSaveStoreSettings} className="space-y-3.5">
          <div
            className={`border rounded-2xl p-4 space-y-3 transition-colors ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <h3 className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              <Store className="w-3.5 h-3.5 text-neutral-400" />
              <span>Informasi Bisnis & Nota</span>
            </h3>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">Nama Toko *</label>
                <input
                  required
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">Slogan / Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="Cth: Coffee & Daily Goods"
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">Alamat Toko</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">No. Telp / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">Catatan Kaki Struk</label>
                <textarea
                  value={receiptFooter}
                  onChange={e => setReceiptFooter(e.target.value)}
                  rows={2}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Preferensi Cetak */}
          <div
            className={`border rounded-2xl p-4 space-y-3 transition-colors ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Preferensi Cetak & Pajak
            </h3>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-300">Lebar Kertas Printer Thermal:</span>
              <div
                className={`flex p-0.5 rounded-lg border ${
                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-100 border-neutral-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPaperWidth('58mm')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    paperWidth === '58mm'
                      ? isDark
                        ? 'bg-white text-neutral-950'
                        : 'bg-neutral-900 text-white'
                      : 'text-neutral-500'
                  }`}
                >
                  58mm
                </button>
                <button
                  type="button"
                  onClick={() => setPaperWidth('80mm')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    paperWidth === '80mm'
                      ? isDark
                        ? 'bg-white text-neutral-950'
                        : 'bg-neutral-900 text-white'
                      : 'text-neutral-500'
                  }`}
                >
                  80mm
                </button>
              </div>
            </div>

            <div
              className={`flex items-center justify-between text-xs pt-2 border-t ${
                isDark ? 'border-neutral-800' : 'border-neutral-100'
              }`}
            >
              <div>
                <span className={`block font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-900'}`}>
                  Pajak PB1 / PPN Otomatis
                </span>
                <span className="text-[10px] text-neutral-500">Dikenakan di nota kasir</span>
              </div>
              <input
                type="checkbox"
                checked={enableTax}
                onChange={e => setEnableTax(e.target.checked)}
                className="w-4 h-4 accent-neutral-900 rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-transform shadow-sm ${
              isDark
                ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan Toko</span>
          </button>

          {savedSettingsNotice && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-center text-xs font-bold">
              Pengaturan toko berhasil disimpan!
            </div>
          )}
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION: KELOLA MENU & HARGA MODAL                           */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'produk' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-mono">
              Total {products.length} menu aktif
            </span>
            <button
              onClick={openAddProductModal}
              className={`px-3 py-1.5 font-bold rounded-xl text-xs inline-flex items-center gap-1 shadow-xs ${
                isDark
                  ? 'bg-white text-neutral-950 hover:bg-neutral-200'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Menu</span>
            </button>
          </div>

          <div className="space-y-2">
            {products.map(prod => (
              <div
                key={prod.id}
                className={`border rounded-2xl p-3 flex items-center justify-between gap-3 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800'
                    : 'bg-white border-neutral-200/90 shadow-xs'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {prod.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {prod.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1 font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatRupiah(prod.price)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Modal: {formatRupiah(prod.costPrice || 0)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Stok: {prod.stock}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditProductModal(prod)}
                    className={`p-2 rounded-xl text-xs ${
                      isDark ? 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                    title="Edit Menu"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs"
                    title="Hapus Menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION: KEAMANAN & ADMIN MASTER (GANTI PIN & BACKUP)          */}
      {/* ------------------------------------------------------------- */}
      {activeSection === 'keamanan' && (
        <div className="space-y-3.5">
          {/* Ubah PIN Admin */}
          <form
            onSubmit={handleChangeAdminPin}
            className={`border rounded-2xl p-4 space-y-3 ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Ubah PIN Akses Admin
              </h3>
            </div>
            <p className="text-[11px] text-neutral-500">
              Ganti 4-digit PIN default ({targetAdminPin}) dengan kode rahasia pemilik toko.
            </p>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">PIN Lama</label>
                <input
                  required
                  type="password"
                  maxLength={6}
                  value={currentPinAttempt}
                  onChange={e => setCurrentPinAttempt(e.target.value)}
                  placeholder="Ketik PIN saat ini"
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none font-mono ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">PIN Baru (min 4 digit)</label>
                  <input
                    required
                    type="password"
                    maxLength={6}
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    placeholder="PIN baru"
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">Konfirmasi PIN Baru</label>
                  <input
                    required
                    type="password"
                    maxLength={6}
                    value={confirmNewPin}
                    onChange={e => setConfirmNewPin(e.target.value)}
                    placeholder="Ulangi PIN baru"
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                    }`}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 font-bold rounded-xl text-xs shadow-xs active:scale-95 transition-all ${
                isDark ? 'bg-white text-neutral-950' : 'bg-neutral-900 text-white'
              }`}
            >
              Simpan PIN Admin Baru
            </button>

            {pinChangeMessage && (
              <div
                className={`p-2.5 rounded-xl text-center text-xs font-bold border ${
                  pinChangeMessage.success
                    ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                }`}
              >
                {pinChangeMessage.text}
              </div>
            )}
          </form>

          {/* Backup Database Toko */}
          <div
            className={`border rounded-2xl p-4 space-y-3 ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-neutral-500" />
              <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Cadangan & Ekspor Database (JSON)
              </h3>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Unduh seluruh database (produk, stok, customer CRM otomatis, riwayat nota) sebagai file cadangan JSON.
            </p>

            <button
              onClick={handleBackupJson}
              className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl border active:scale-95 transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-750'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File Cadangan JSON</span>
            </button>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleSaveProduct}
            className={`w-full max-w-md border rounded-t-3xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto no-scrollbar space-y-3 ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xl'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-neutral-800' : 'border-neutral-100'}`}>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {editingProduct ? 'Edit Menu Produk' : 'Tambah Menu Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">Nama Produk / Menu *</label>
                <input
                  required
                  type="text"
                  value={pName}
                  onChange={e => setPName(e.target.value)}
                  placeholder="Cth: Kopi Susu Creamy"
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">Kategori</label>
                  <input
                    type="text"
                    value={pCategory}
                    onChange={e => setPCategory(e.target.value)}
                    placeholder="Minuman, Makanan..."
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">Satuan</label>
                  <input
                    type="text"
                    value={pUnit}
                    onChange={e => setPUnit(e.target.value)}
                    placeholder="cup, pcs, porsi"
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                      isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">Harga Jual (Rp) *</label>
                  <input
                    required
                    type="number"
                    value={pPrice}
                    onChange={e => setPPrice(Number(e.target.value))}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">Harga Modal (Rp)</label>
                  <input
                    type="number"
                    value={pCostPrice}
                    onChange={e => setPCostPrice(Number(e.target.value))}
                    className={`w-full text-xs p-2.5 rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">Jumlah Stok</label>
                <input
                  type="number"
                  value={pStock}
                  onChange={e => setPStock(Number(e.target.value))}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none font-mono ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">
                  URL Foto Produk (Cloudinary / Web Link)
                </label>
                <input
                  type="url"
                  value={pImageUrl}
                  onChange={e => setPImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none font-mono ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 block mb-1">Deskripsi Singkat</label>
                <textarea
                  value={pDescription}
                  onChange={e => setPDescription(e.target.value)}
                  rows={2}
                  placeholder="Bahan, cita rasa, atau detail produk..."
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${
                    isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-900 border-neutral-200'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className={`flex-1 py-2.5 font-bold rounded-xl text-xs ${
                  isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Batal
              </button>
              <button
                type="submit"
                className={`flex-1 py-2.5 font-bold rounded-xl text-xs shadow-xs ${
                  isDark ? 'bg-white text-neutral-950' : 'bg-neutral-900 text-white'
                }`}
              >
                Simpan Menu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
