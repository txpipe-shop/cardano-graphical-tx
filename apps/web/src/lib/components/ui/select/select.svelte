<script lang="ts">
  import { cn } from '@/utils';

  interface SelectItem {
    value: string;
    label: string;
  }

  interface Props {
    value?: string;
    placeholder?: string;
    items: SelectItem[];
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    class?: string;
    subtitle?: string;
  }

  let {
    value = $bindable(),
    placeholder = 'Select an option...',
    items,
    onValueChange,
    disabled = false,
    class: className,
    subtitle = '',
    ...restProps
  }: Props = $props();

  let isOpen = $state(false);
  let selectedItem = $derived(items.find((item) => item.value === value));

  function handleSelect(item: SelectItem) {
    value = item.value;
    onValueChange?.(item.value);
    isOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class={cn('relative', className)} {...restProps}>
  {#if !isOpen && subtitle}
    <div class="absolute bottom-9 left-1.5 text-xs">{subtitle}</div>
  {/if}
  <button
    type="button"
    class={cn(
      'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {disabled}
    onclick={() => !disabled && (isOpen = !isOpen)}
  >
    <span class={cn('truncate', !selectedItem && 'text-muted-foreground')}>
      {selectedItem?.label || placeholder}
    </span>
    <svg
      class={cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  {#if isOpen}
    <div
      class="bg-popover text-popover-foreground absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border p-1 shadow-md"
    >
      {#each items as item (item.value)}
        <button
          type="button"
          class={cn(
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
            value === item.value && 'bg-accent text-accent-foreground'
          )}
          onclick={() => handleSelect(item)}
          aria-label="show select"
        >
          {item.label}
          {#if value === item.value}
            <svg
              class="ml-auto h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

{#if isOpen}
  <button
    class="fixed inset-0 z-40"
    onclick={() => (isOpen = false)}
    aria-label="close select"
    tabindex="-1"
  ></button>
{/if}
