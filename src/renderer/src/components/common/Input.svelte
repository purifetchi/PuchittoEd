<script lang="ts">
  let { value = $bindable('') }: { value?: string } = $props()
</script>

<input class="text-input" bind:value />

<style>
  .text-input {
    flex: 1;
    background: var(--bg-base);
    border: 1px solid var(--border-color);
    color: var(--text-light);
    padding: 4px 8px;
    border-radius: 3px;
    outline: none;
  }
</style>
