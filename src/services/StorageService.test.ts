import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService } from './StorageService';

// jsdom needs a URL to support localStorage; stub it if not available
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(() => {
    localStorage.clear();
    // Reset singleton for each test
    // @ts-expect-error reset singleton
    StorageService.instance = undefined;
    storage = StorageService.getInstance();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('getInstance returns same instance (singleton)', () => {
    const a = StorageService.getInstance();
    const b = StorageService.getInstance();
    expect(a).toBe(b);
  });

  describe('made count', () => {
    it('getMadeCount returns 0 when no key set', () => {
      expect(storage.getMadeCount()).toBe(0);
    });

    it('incrementMadeCount increments and persists', () => {
      expect(storage.incrementMadeCount()).toBe(1);
      expect(storage.incrementMadeCount()).toBe(2);
      expect(storage.getMadeCount()).toBe(2);
    });
  });

  describe('user made it', () => {
    it('getUserMadeIt returns false when not set', () => {
      expect(storage.getUserMadeIt()).toBe(false);
    });

    it('setUserMadeIt persists true', () => {
      storage.setUserMadeIt();
      expect(storage.getUserMadeIt()).toBe(true);
    });
  });

  describe('theme', () => {
    it('getTheme returns null when not set', () => {
      expect(storage.getTheme()).toBeNull();
    });

    it('setTheme and getTheme round-trip', () => {
      storage.setTheme('dark');
      expect(storage.getTheme()).toBe('dark');
    });
  });

  describe('language', () => {
    it('getLanguage returns null when not set', () => {
      expect(storage.getLanguage()).toBeNull();
    });

    it('setLanguage and getLanguage round-trip', () => {
      storage.setLanguage('es');
      expect(storage.getLanguage()).toBe('es');
    });
  });
});
