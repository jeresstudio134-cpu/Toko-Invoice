import React, { useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/format';
import { getProductImages } from '../utils/cloudinary';
import { ImageCarousel } from './ImageCarousel';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAdd?: (product: Product) => void;
  theme?: 'light' | 'dark';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAdd,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const images = getProductImages(product);
  const outOfStock = product.stock <= 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`relative w-full max-w-md max-h-[92vh] overflow-y-auto no-scrollbar rounded-t-3xl sm:rounded-2xl border ${
          isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-2xl'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <ImageCarousel
          images={images}
          alt={product.name}
          isDark={isDark}
          className="aspect-square w-full"
        />

        <div className="p-5 space-y-3">
          <div className="text-[11px] text-neutral-500 font-mono">
            {product.category} · {product.unit}
          </div>
          <h3 className={`text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {product.name}
          </h3>
          <div className="flex items-end justify-between">
            <span className="text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {formatRupiah(product.price)}
            </span>
            <span
              className={`text-[11px] font-mono font-bold ${
                outOfStock ? 'text-red-500' : 'text-neutral-500'
              }`}
            >
              {outOfStock ? 'Stok habis' : `Stok: ${product.stock}`}
            </span>
          </div>
          {product.description && (
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {product.description}
            </p>
          )}

          {onAdd && (
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => {
                onAdd(product);
                onClose();
              }}
              className={`w-full py-3 font-bold rounded-xl text-xs inline-flex items-center justify-center gap-1.5 disabled:opacity-40 ${
                isDark ? 'bg-white text-neutral-950' : 'bg-neutral-900 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Pilih</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};