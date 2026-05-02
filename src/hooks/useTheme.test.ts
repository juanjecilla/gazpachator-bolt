import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockStorage = {
  getTheme: vi.fn().mockReturnValue(null),
  setTheme: vi.fn(),
};

// Must mock StorageService before importing useTheme
vi.mock('../services/StorageService', () => ({
  StorageService: {
    getInstance: vi.fn(() => mockStorage),
  },
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark', 'light');
    mockStorage.getTheme.mockReturnValue(null);
    mockStorage.setTheme.mockClear();
  });

  it('defaults to system theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('changeTheme to dark adds dark class to html', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.changeTheme('dark');
    });
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('changeTheme to light removes dark class', () => {
    document.documentElement.classList.add('dark');
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.changeTheme('light');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
