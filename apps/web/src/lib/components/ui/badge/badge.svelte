<script lang="ts" module>
  import { tv, type VariantProps } from 'tailwind-variants';

  export const badgeVariants = tv({
    base: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
    variants: {
      variant: {
        default: 'bg-primary text-primary-popover hover:bg-primary/90 border-transparent',
        secondary:
          'bg-secondary dark:text-[#1A1A2E] hover:bg-secondary/90 border-transparent',
        destructive:
          'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent dark:text-white',
        outline: 'text-popover hover:bg-accent hover:text-accent-foreground text-muted-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  });

  export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
  import { cn, type WithElementRef } from '$lib/utils.js';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    href,
    class: className,
    variant = 'default',
    children,
    ...restProps
  }: WithElementRef<HTMLAnchorAttributes> & {
    variant?: BadgeVariant;
  } = $props();
</script>

<svelte:element
  this={href ? 'a' : 'span'}
  bind:this={ref}
  data-slot="badge"
  {href}
  class={cn(badgeVariants({ variant }), className)}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
