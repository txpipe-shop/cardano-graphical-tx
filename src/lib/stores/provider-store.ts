import { browser } from '$app/environment';
import {
  LOCAL_PROVIDER_ID,
  type ProviderConfig,
  type ProviderStore
} from '@/types/provider-config';
import { derived, writable } from 'svelte/store';

const CURRENT_PROVIDER_KEY = 'explorer-current-provider';

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
  const initialState: ProviderStore = {
    currentProvider: null,
    allProviders: []
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
    initializeWithServerData: (serverProviders: ProviderConfig[]) => {
      const storedProviderId = loadCurrentProviderFromStorage();
      console.log('asdasdsadas', serverProviders);
      const allProviders = serverProviders;

      let currentProvider = null;
      if (storedProviderId)
        currentProvider = allProviders.find((p) => p.id === storedProviderId) ?? null;
      else currentProvider = allProviders.find((p) => p.id === LOCAL_PROVIDER_ID) ?? null;

      update((state) => ({
        ...state,
        allProviders,
        currentProvider
      }));
    },
    updateLocalProvider: (updates: Partial<ProviderConfig>) => {
      update((state) => {
        return {
          ...state,
          allProviders: state.allProviders.map((p) =>
            p.id === LOCAL_PROVIDER_ID ? { ...p, ...updates } : p
          )
        };
      });
    },
    clearStorage: () => {
      if (browser) localStorage.removeItem(CURRENT_PROVIDER_KEY);

      update((state) => ({
        ...state,
        customProviders: [],
        allProviders: state.allProviders.filter((p) => !p.isLocal),
        currentProvider: state.allProviders.find((p) => !p.isLocal) || null
      }));
    },
    reset: () => set(initialState)
  };
}

export const providerStore = createProviderStore();

export const currentProvider = derived(providerStore, ($store) => $store.currentProvider);

export const allProviders = derived(providerStore, ($store) => $store.allProviders);
