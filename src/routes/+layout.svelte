<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<div class="min-h-screen min-w-screen p-5">
  {@render children()}
</div>
