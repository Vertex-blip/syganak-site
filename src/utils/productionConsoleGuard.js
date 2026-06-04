const lockConsole = () => {
  if (typeof window === 'undefined' || import.meta.env.DEV) return;

  const consoleRef = window.console;
  if (!consoleRef || window.__SYGANAKI_CONSOLE_GUARD__) return;
  window.__SYGANAKI_CONSOLE_GUARD__ = true;

  const write = Function.prototype.bind.call(consoleRef.log, consoleRef);
  const warn = Function.prototype.bind.call(consoleRef.warn, consoleRef);

  consoleRef.clear?.();
  write('%cТоқтаңыз!', 'color:#ff1f1f;font-size:52px;font-weight:900;text-shadow:0 1px 0 #111;');
  write(
    '%cБұл консоль тек әзірлеушілерге арналған. Мұнда код қою, токен/пароль енгізу немесе белгісіз команданы орындау аккаунт пен деректерге қауіп төндіреді.',
    'color:#f8fafc;background:#022c22;font-size:16px;font-weight:700;line-height:1.6;padding:12px;border-radius:6px;',
  );
  warn('%cSecurity notice: all admin actions are protected by Firebase Auth, Firestore rules, CSP and Vercel edge headers.', 'color:#d6a650;font-weight:700;');

  const blocked = () => {};
  ['log', 'debug', 'info', 'warn', 'table', 'trace'].forEach((method) => {
    try {
      consoleRef[method] = blocked;
    } catch {
      // Browser console methods may be read-only in some environments.
    }
  });
};

lockConsole();
