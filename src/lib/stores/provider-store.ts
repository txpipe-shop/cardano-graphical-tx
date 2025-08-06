import { writable, derived } from 'svelte/store';
import type { ProviderConfig, ProviderStore } from '@/types/provider-config';
import { BUILTIN_PROVIDERS } from '@/types/provider-config';

function createProviderStore() {
  const initialState: ProviderStore = {
    currentProvider: BUILTIN_PROVIDERS[0],
    customProviders: [],
    allProviders: [...BUILTIN_PROVIDERS]
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
    },
    initializeWithServerData: (
      serverProviders: ProviderConfig[],
      defaultProvider: ProviderConfig
    ) => {
      update((state) => ({
        ...state,
        allProviders: [...serverProviders, ...state.customProviders],
        currentProvider: defaultProvider
      }));
    },
    addCustomProvider: (provider: Omit<ProviderConfig, 'id' | 'isBuiltIn'>) => {
      const newProvider: ProviderConfig = {
        ...provider,
        id: `custom-${Date.now()}`,
        isBuiltIn: false
      };

      update((state) => ({
        ...state,
        customProviders: [...state.customProviders, newProvider],
        allProviders: [...state.allProviders, newProvider]
      }));

      return newProvider;
    },
    removeCustomProvider: (providerId: string) => {
      update((state) => ({
        ...state,
        customProviders: state.customProviders.filter((p) => p.id !== providerId),
        allProviders: state.allProviders.filter((p) => p.id !== providerId),
        currentProvider:
          state.currentProvider?.id === providerId ? BUILTIN_PROVIDERS[0] : state.currentProvider
      }));
    },
    updateCustomProvider: (providerId: string, updates: Partial<ProviderConfig>) => {
      update((state) => ({
        ...state,
        customProviders: state.customProviders.map((p) =>
          p.id === providerId ? { ...p, ...updates } : p
        ),
        allProviders: state.allProviders.map((p) =>
          p.id === providerId ? { ...p, ...updates } : p
        )
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
