import { CartItem } from '../types';

/**
 * Mendapatkan harga satuan efektif per item (harga custom kasir atau harga master produk)
 */
export const getItemEffectiveUnitPrice = (item: CartItem): number => {
  if (item.customPrice !== undefined && item.customPrice !== null && !isNaN(item.customPrice)) {
    return Math.max(0, item.customPrice);
  }
  return item.product.price;
};

/**
 * Menghitung luas (panjang x lebar).
 * Jika satuan meter ('m'), luas = panjang * lebar (m²).
 * Jika satuan centimeter ('cm'), luas = (panjang * lebar) / 10000 (m²).
 * Mengembalikan null jika panjang atau lebar tidak diisi.
 */
export const getItemArea = (dim: {
  length?: number;
  width?: number;
  dimensionUnit?: 'm' | 'cm';
}): number | null => {
  if (
    dim.length !== undefined &&
    dim.width !== undefined &&
    dim.length > 0 &&
    dim.width > 0
  ) {
    if (dim.dimensionUnit === 'cm') {
      return (dim.length * dim.width) / 10000;
    }
    return dim.length * dim.width;
  }
  return null;
};

/**
 * Menghitung subtotal untuk satu item di keranjang kasir.
 * Rumus:
 * - Tanpa ukuran: Harga Satuan x Qty
 * - Dengan ukuran: Harga Satuan x Luas (m²) x Qty
 */
export const getItemSubtotal = (item: CartItem): number => {
  const unitPrice = getItemEffectiveUnitPrice(item);
  const area = getItemArea(item);
  if (area !== null) {
    return Math.round(unitPrice * area * item.quantity);
  }
  return unitPrice * item.quantity;
};

/**
 * Format teks representasi dimensi
 */
export const formatDimensionString = (dim: {
  length?: number;
  width?: number;
  dimensionUnit?: 'm' | 'cm';
  area?: number;
}): string => {
  if (!dim.length || !dim.width) return '';
  const unit = dim.dimensionUnit || 'm';
  const area =
    dim.area !== undefined
      ? dim.area
      : dim.dimensionUnit === 'cm'
      ? (dim.length * dim.width) / 10000
      : dim.length * dim.width;

  const areaStr = Number.isInteger(area) ? area.toString() : area.toFixed(2);
  return `${dim.length} × ${dim.width} ${unit} (${areaStr} m²)`;
};
