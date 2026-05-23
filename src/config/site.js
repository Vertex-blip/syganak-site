export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')
).replace(/\/$/, '');

export const KASPI_DONATION_URL = import.meta.env.VITE_KASPI_DONATION_URL || 'https://kaspi.kz/transfers';

export const MAP_URL = 'https://2gis.kz/astana/geo/70000001066292633/71.416744,51.125984';
export const WHATSAPP_NUMBER = '+77761764131';
