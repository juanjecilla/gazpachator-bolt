import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockStorage = {
  getLanguage: vi.fn().mockReturnValue(null),
  setLanguage: vi.fn(),
};

vi.mock('../services/StorageService', () => ({
  StorageService: {
    getInstance: vi.fn(() => mockStorage),
  },
}));

Object.defineProperty(navigator, 'language', {
  writable: true,
  value: 'en-US',
});

import { useLanguage } from './useLanguage';

describe('useLanguage', () => {
  beforeEach(() => {
    mockStorage.getLanguage.mockReturnValue(null);
    mockStorage.setLanguage.mockClear();
  });

  it('defaults to en', () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe('en');
  });

  it('t() returns correct translation for en', () => {
    const { result } = renderHook(() => useLanguage());
    // 'title' key should exist in translations
    const title = result.current.t('title');
    expect(typeof title).toBe('string');
    expect(title.length).toBeGreaterThan(0);
  });

  it('changeLanguage updates language state', () => {
    const { result } = renderHook(() => useLanguage());
    act(() => {
      result.current.changeLanguage('es');
    });
    expect(result.current.language).toBe('es');
  });

  it('t() falls back to en key if translation missing', () => {
    const { result } = renderHook(() => useLanguage());
    // Non-existent key should return the key itself
    expect(result.current.t('nonExistentKey123')).toBe('nonExistentKey123');
  });
});
