import { writable, derived } from 'svelte/store';
import type { ProviderConfig, ProviderStore } from '@/types/provider-config';
import { BUILTIN_PROVIDERS } from '@/types/provider-config';
import { browser } from '$app/environment';

const STORAGE_KEY = 'explorer-custom-providers';
const CURRENT_PROVIDER_KEY = 'explorer-current-provider';

function loadCustomProvidersFromStorage(): ProviderConfig[] {
  if (!browser) return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load custom providers from localStorage:', error);
    return [];
  }
}

function saveCustomProvidersToStorage(providers: ProviderConfig[]): void {
  if (!browser) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
  } catch (error) {
    console.warn('Failed to save custom providers to localStorage:', error);
  }
}

function loadCurrentProviderFromStorage(): string | null {
  if (!browser) return null;

  try {
    return localStorage.getItem(CURRENT_PROVIDER_KEY);
  } catch (error) {
    console.warn('Failed to load current provider from localStorage:', error);
    return null;
  }
}

function saveCurrentProviderToStorage(providerId: string): void {
  if (!browser) return;

  try {
    localStorage.setItem(CURRENT_PROVIDER_KEY, providerId);
  } catch (error) {
    console.warn('Failed to save current provider to localStorage:', error);
  }
}

function createProviderStore() {
  const storedCustomProviders = loadCustomProvidersFromStorage();

  const initialState: ProviderStore = {
    currentProvider: BUILTIN_PROVIDERS[0],
    customProviders: storedCustomProviders,
    allProviders: [...BUILTIN_PROVIDERS, ...storedCustomProviders]
  };

  const { subscribe, set, update } = writable<ProviderStore>(initialState);

  return {
    subscribe,
    update,
    setCurrentProvider: (provider: ProviderConfig) => {
      update((state) => ({
        ...state,
        currentProvider: provider
      }));
      saveCurrentProviderToStorage(provider.id);
    },
    initializeWithServerData: (
      serverProviders: ProviderConfig[],
      defaultProvider: ProviderConfig
    ) => {
      const storedProviderId = loadCurrentProviderFromStorage();
      const allProviders = [...serverProviders, ...storedCustomProviders];

      let currentProvider = defaultProvider;
      if (storedProviderId) {
        const foundProvider = allProviders.find((p) => p.id === storedProviderId);
        if (foundProvider) {
          currentProvider = foundProvider;
        }
      }

      update((state) => ({
        ...state,
        allProviders,
        currentProvider
      }));
    },
    addCustomProvider: (provider: Omit<ProviderConfig, 'id' | 'isBuiltIn'>) => {
      const newProvider: ProviderConfig = {
        ...provider,
        id: `custom-${Date.now()}`,
        isBuiltIn: false
      };

      update((state) => {
        const newCustomProviders = [...state.customProviders, newProvider];
        saveCustomProvidersToStorage(newCustomProviders);

        return {
          ...state,
          customProviders: newCustomProviders,
          allProviders: [...state.allProviders, newProvider]
        };
      });

      return newProvider;
    },
    removeCustomProvider: (providerId: string) => {
      update((state) => {
        const newCustomProviders = state.customProviders.filter((p) => p.id !== providerId);
        saveCustomProvidersToStorage(newCustomProviders);

        return {
          ...state,
          customProviders: newCustomProviders,
          allProviders: state.allProviders.filter((p) => p.id !== providerId),
          currentProvider:
            state.currentProvider?.id === providerId ? BUILTIN_PROVIDERS[0] : state.currentProvider
        };
      });
    },
    updateCustomProvider: (providerId: string, updates: Partial<ProviderConfig>) => {
      update((state) => {
        const newCustomProviders = state.customProviders.map((p) =>
          p.id === providerId ? { ...p, ...updates } : p
        );
        saveCustomProvidersToStorage(newCustomProviders);

        return {
          ...state,
          customProviders: newCustomProviders,
          allProviders: state.allProviders.map((p) =>
            p.id === providerId ? { ...p, ...updates } : p
          )
        };
      });
    },
    clearStorage: () => {
      if (browser) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CURRENT_PROVIDER_KEY);
      }

      update((state) => ({
        ...state,
        customProviders: [],
        allProviders: [...BUILTIN_PROVIDERS],
        currentProvider: BUILTIN_PROVIDERS[0]
      }));
    },
    reset: () => set(initialState)
  };
}

export const providerStore = createProviderStore();

export const currentProvider = derived(providerStore, ($store) => $store.currentProvider);

export const allProviders = derived(providerStore, ($store) => $store.allProviders);

export const customProviders = derived(providerStore, ($store) => $store.customProviders);

export const builtInProviders = derived(providerStore, () => BUILTIN_PROVIDERS);
