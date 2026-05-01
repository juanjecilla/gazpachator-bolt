// Singleton Pattern: Single instance for storage management
export class StorageService {
  private static instance: StorageService;
  private readonly COUNTER_KEY = 'gazpacho-made-count';
  private readonly THEME_KEY = 'gazpacho-theme';
  private readonly LANGUAGE_KEY = 'gazpacho-language';

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  getMadeCount(): number {
    const count = localStorage.getItem(this.COUNTER_KEY);
    return count ? parseInt(count, 10) : 0;
  }

  incrementMadeCount(): number {
    const currentCount = this.getMadeCount();
    const newCount = currentCount + 1;
    localStorage.setItem(this.COUNTER_KEY, newCount.toString());
    return newCount;
  }

  getTheme(): string | null {
    return localStorage.getItem(this.THEME_KEY);
  }

  setTheme(theme: string): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getLanguage(): string | null {
    return localStorage.getItem(this.LANGUAGE_KEY);
  }

  setLanguage(language: string): void {
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }
}