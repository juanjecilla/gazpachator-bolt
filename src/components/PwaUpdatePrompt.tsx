import React, { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

/**
 * Testability seam (no production behavior change):
 *
 * The "new version available" state is driven by the service worker, which is
 * only registered in a real browser against a built app — it never fires during
 * `vite dev`, which is what the Playwright suite runs against. To keep this
 * prompt covered by e2e without a full SW build, the component listens for a
 * `pwa:need-refresh` window event to force the prompt open, and reads an
 * optional `window.__pwaReloadForTest` hook so a test can observe the Reload
 * action (the real `updateServiceWorker` reloads the page, which a test cannot
 * assert on). Production never dispatches the event nor sets the hook, so both
 * branches are inert outside the test environment.
 */
declare global {
  interface Window {
    __pwaReloadForTest?: () => void;
  }
}

export const PWA_NEED_REFRESH_EVENT = 'pwa:need-refresh';

export const PwaUpdatePrompt: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setInterval(() => r.update(), 60 * 60 * 1000);
      }
    },
  });

  useEffect(() => {
    const showPrompt = () => setNeedRefresh(true);
    window.addEventListener(PWA_NEED_REFRESH_EVENT, showPrompt);
    return () => window.removeEventListener(PWA_NEED_REFRESH_EVENT, showPrompt);
  }, [setNeedRefresh]);

  const handleReload = () => {
    if (window.__pwaReloadForTest) {
      window.__pwaReloadForTest();
      return;
    }
    updateServiceWorker(true);
  };

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="pwa-update-prompt"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-lg dark:border-amber-700 dark:bg-amber-900 print:hidden"
    >
      <RefreshCw size={18} className="shrink-0 text-amber-600 dark:text-amber-400" />
      <span className="text-sm text-amber-800 dark:text-amber-200">New version available</span>
      <button
        onClick={handleReload}
        data-testid="pwa-reload-button"
        className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
      >
        Reload
      </button>
      <button
        onClick={() => setNeedRefresh(false)}
        data-testid="pwa-dismiss-button"
        aria-label="Dismiss update notification"
        className="text-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
      >
        <X size={16} />
      </button>
    </div>
  );
};
