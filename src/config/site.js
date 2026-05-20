export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')
).replace(/\/$/, '');

// TODO: set VITE_KASPI_DONATION_URL to the real Kaspi payment link before publishing donations.
export const KASPI_DONATION_URL = import.meta.env.VITE_KASPI_DONATION_URL || '';
export const KASPI_FALLBACK_URL =
  import.meta.env.VITE_KASPI_FALLBACK_URL || 'https://kaspi.kz/kz/transfers';

export const MAP_URL = 'https://2gis.kz/astana/geo/70000001066292633/71.416744,51.125984';
export const WHATSAPP_NUMBER = '+77761764131';
export const KASPI_SUPPORT_NUMBER = import.meta.env.VITE_KASPI_SUPPORT_NUMBER || WHATSAPP_NUMBER;
