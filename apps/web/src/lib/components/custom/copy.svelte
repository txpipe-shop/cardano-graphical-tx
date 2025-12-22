<script lang="ts">
  import * as Alert from '$lib/components/ui/alert/index.js';
  let { content, text }: { content: string; text?: string } = $props();
  let alert = $state(false);
  function copyContent() {
    navigator.clipboard.writeText(content);
    alert = true;
    setTimeout(() => {
      alert = false;
    }, 2000);
  }
</script>

<button onclick={copyContent} class="cursor-pointer" aria-label="Copy content">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-copy copy fsmall text-info d-none d-md-inline"
    data-clipboard-text="a2e2f52593ccb3496441f71c416ad063b83fa584781dd1b1bf67e5dbd2eda30e"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path
      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
    ></path>
  </svg>
</button>

{#if alert}
  <Alert.Root
    class="animate-in fade-in slide-in-from-bottom-8 fixed bottom-4 left-1/2 z-50 w-auto -translate-x-1/2 rounded-lg border-green-300 bg-green-600 px-4 py-2 text-white shadow-lg duration-300"
  >
    <Alert.Title>Copied {text ? text + ' ' : ''}to clipboard!</Alert.Title>
  </Alert.Root>
{/if}
