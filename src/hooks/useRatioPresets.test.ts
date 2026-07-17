import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRatioPresets, BUILT_IN_PRESET_ID, DEFAULT_PROPORTIONS } from './useRatioPresets';
import { StorageService } from '../services/StorageService';

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

const proportions = {
  cucumber: 400,
  greenPepper: 200,
  garlic: 15,
  oliveOil: 20,
  salt: 7,
  vinegar: 22,
};

describe('useRatioPresets', () => {
  beforeEach(() => {
    localStorage.clear();
    // @ts-expect-error reset singleton
    StorageService.instance = undefined;
  });

  it('always includes exactly one built-in default preset at the front', () => {
    const { result } = renderHook(() => useRatioPresets());
    expect(result.current.presets).toHaveLength(1);
    const builtIn = result.current.presets[0];
    expect(builtIn.id).toBe(BUILT_IN_PRESET_ID);
    expect(builtIn.isBuiltIn).toBe(true);
    expect(builtIn.proportions).toEqual(DEFAULT_PROPORTIONS);
  });

  it('savePreset appends a user preset after the built-in', () => {
    const { result } = renderHook(() => useRatioPresets());
    act(() => {
      result.current.savePreset({ name: 'Spicy', proportions });
    });
    expect(result.current.presets).toHaveLength(2);
    expect(result.current.presets[0].isBuiltIn).toBe(true);
    expect(result.current.presets[1].name).toBe('Spicy');
    expect(result.current.presets[1].isBuiltIn).toBe(false);
    expect(result.current.presets[1].proportions).toEqual(proportions);
  });

  it('savePreset returns the created preset', () => {
    const { result } = renderHook(() => useRatioPresets());
    let id = '';
    act(() => {
      id = result.current.savePreset({ name: 'Mild', proportions }).id;
    });
    expect(id).not.toBe('');
    expect(result.current.presets.find((p) => p.id === id)?.name).toBe('Mild');
  });

  it('deletePreset removes a user preset', () => {
    const { result } = renderHook(() => useRatioPresets());
    let id = '';
    act(() => {
      id = result.current.savePreset({ name: 'Temp', proportions }).id;
    });
    act(() => {
      result.current.deletePreset(id);
    });
    expect(result.current.presets).toHaveLength(1);
    expect(result.current.presets[0].isBuiltIn).toBe(true);
  });

  it('deletePreset cannot delete the built-in preset', () => {
    const { result } = renderHook(() => useRatioPresets());
    act(() => {
      result.current.deletePreset(BUILT_IN_PRESET_ID);
    });
    expect(result.current.presets).toHaveLength(1);
    expect(result.current.presets[0].id).toBe(BUILT_IN_PRESET_ID);
  });

  it('loads persisted user presets on mount', () => {
    const storage = StorageService.getInstance();
    storage.saveRatioPreset({ name: 'Persisted', proportions });
    const { result } = renderHook(() => useRatioPresets());
    expect(result.current.presets).toHaveLength(2);
    expect(result.current.presets[1].name).toBe('Persisted');
  });
});
