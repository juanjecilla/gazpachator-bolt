import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportShare } from './ExportShare';
import type { Recipe } from '../types/Recipe';
import type { TranslationKey } from '../data/translations';

const t = (key: TranslationKey) => key;

const recipe: Recipe = {
  ingredients: [
    { id: 'tomato', name: 'tomato', amount: 1000, unit: 'g', proportion: 1 },
    { id: 'cucumber', name: 'cucumber', amount: 333, unit: 'g', proportion: 0.333 },
  ],
  totalVolume: 1.47,
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ExportShare', () => {
  it('renders a print button', () => {
    render(<ExportShare recipe={recipe} t={t} />);
    expect(screen.getByTestId('print-recipe-button')).toBeInTheDocument();
  });

  it('clicking the print button triggers window.print', async () => {
    const print = vi.fn();
    vi.stubGlobal('print', print);

    render(<ExportShare recipe={recipe} t={t} />);
    await userEvent.click(screen.getByTestId('print-recipe-button'));

    expect(print).toHaveBeenCalledOnce();
  });

  it('renders a JSON export button', () => {
    render(<ExportShare recipe={recipe} t={t} />);
    expect(screen.getByTestId('export-json-button')).toBeInTheDocument();
  });

  it('clicking the JSON export button downloads a .json file and revokes the object URL', async () => {
    const createObjectURL = vi.fn(() => 'blob:mock-url');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });

    const originalCreateElement = document.createElement.bind(document);
    const anchor = originalCreateElement('a');
    const clickSpy = vi.fn();
    anchor.click = clickSpy;
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName: string) =>
        tagName === 'a' ? anchor : originalCreateElement(tagName)
      );

    render(<ExportShare recipe={recipe} t={t} />);
    await userEvent.click(screen.getByTestId('export-json-button'));

    expect(createObjectURL).toHaveBeenCalledOnce();
    const blobArg = createObjectURL.mock.calls[0][0] as Blob;
    expect(blobArg.type).toBe('application/json');

    expect(anchor.download).toBe('juanje-gazpacho-recipe.json');
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

    createElementSpy.mockRestore();
  });
});
