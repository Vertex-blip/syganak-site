const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

export const sanitizeText = (value, maxLength = 1000) =>
  String(value || '')
    .replace(CONTROL_CHARS, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

export const sanitizeFormPayload = (payload, limits = {}) =>
  Object.entries(payload).reduce((acc, [key, value]) => {
    acc[key] = sanitizeText(value, limits[key] || 500);
    return acc;
  }, {});

export const canSubmitForm = (key, intervalMs = 60_000) => {
  if (typeof window === 'undefined') return true;
  const storageKey = `syganaki-rate-${key}`;
  const last = Number(window.localStorage.getItem(storageKey) || 0);
  const now = Date.now();
  if (now - last < intervalMs) return false;
  window.localStorage.setItem(storageKey, String(now));
  return true;
};

export const normalizeKazakhstanPhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';

  let normalized = digits;
  if (normalized.length === 10) normalized = `7${normalized}`;
  if (normalized.length === 11 && normalized.startsWith('8')) {
    normalized = `7${normalized.slice(1)}`;
  }

  return normalized.length === 11 && normalized.startsWith('7')
    ? `+${normalized}`
    : String(value || '').trim();
};

export const isValidKazakhstanPhone = (value) => /^\+7\d{10}$/.test(normalizeKazakhstanPhone(value));

export const isHoneypotFilled = (payload = {}) =>
  Boolean(String(payload.website || payload.company || payload.url || '').trim());

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedExts = /\.(jpe?g|png|webp)$/i;
  const maxSize = 12 * 1024 * 1024;

  const typeOk = file && (allowedTypes.includes(file.type) || allowedExts.test(file.name));
  if (!typeOk) throw new Error('Invalid image type');
  if (file.size > maxSize) throw new Error('Image is too large');
};

export const sanitizeHtml = (html) => {
  if (typeof window === 'undefined') {
    return sanitizeText(html, 4000);
  }

  const allowedTags = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'UL', 'OL', 'LI', 'A']);
  const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');

  doc.body.querySelectorAll('*').forEach((node) => {
    if (!allowedTags.has(node.tagName)) {
      node.replaceWith(...Array.from(node.childNodes));
      return;
    }

    Array.from(node.attributes).forEach((attr) => {
      const isSafeLink = node.tagName === 'A' && attr.name === 'href' && /^https?:\/\//i.test(attr.value);
      if (isSafeLink) {
        node.setAttribute('rel', 'noreferrer');
        node.setAttribute('target', '_blank');
      } else {
        node.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};
