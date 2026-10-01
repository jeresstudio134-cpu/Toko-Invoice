import { Order, StoreSettings } from '../types';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
};

export const formatDateOnly = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
};

/**
 * Membuat format teks struk yang rapi untuk dikirim via WhatsApp atau disalin
 */
export const generateWhatsAppReceiptText = (order: Order, settings: StoreSettings): string => {
  const line = '--------------------------------';
  const itemsText = order.items
    .map(item => {
      let desc = item.productName;
      if (item.length && item.width) {
        const areaStr =
          item.area !== undefined
            ? item.area.toFixed(2)
            : item.dimensionUnit === 'cm'
            ? ((item.length * item.width) / 10000).toFixed(2)
            : (item.length * item.width).toFixed(2);
        desc += ` (${item.length}×${item.width} ${item.dimensionUnit || 'm'} = ${areaStr} m²)`;
      }
      if (item.note) {
        desc += `\n  Catatan: ${item.note}`;
      }
      return `${desc}\n  ${item.quantity}x @ ${formatRupiah(item.price)} = ${formatRupiah(item.subtotal)}`;
    })
    .join('\n');

  let text = `*${settings.storeName.toUpperCase()}*\n`;
  if (settings.tagline) text += `${settings.tagline}\n`;
  if (settings.address) text += `${settings.address}\n`;
  if (settings.phone) text += `Telp/WA: ${settings.phone}\n`;
  text += `${line}\n`;
  text += `No. Nota : *${order.invoiceNumber}*\n`;
  text += `Tanggal  : ${formatDate(order.createdAt)}\n`;
  text += `Pelanggan: *${order.customerName}*${order.customerPhone ? ` (${order.customerPhone})` : ''}\n`;
  text += `Metode   : ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})\n`;
  text += `${line}\n`;
  text += `${itemsText}\n`;
  text += `${line}\n`;
  text += `Subtotal : ${formatRupiah(order.subtotal)}\n`;
  if (order.discount > 0) {
    text += `Diskon   : -${formatRupiah(order.discount)}\n`;
  }
  if (order.tax > 0) {
    text += `Pajak    : +${formatRupiah(order.tax)}\n`;
  }
  text += `*TOTAL    : ${formatRupiah(order.total)}*\n`;
  if (order.paymentMethod === 'tunai' && order.cashGiven) {
    text += `Bayar    : ${formatRupiah(order.cashGiven)}\n`;
    text += `Kembali  : ${formatRupiah(order.cashChange || 0)}\n`;
  }
  text += `${line}\n`;
  text += `${settings.receiptFooter || 'Terima kasih atas pesanan Anda!'}\n`;

  return text;
};

export const getWhatsAppShareUrl = (phone: string, text: string): string => {
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62') && cleanPhone.length > 0) {
    cleanPhone = '62' + cleanPhone;
  }
  const encodedText = encodeURIComponent(text);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
};
