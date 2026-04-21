<script lang="ts">
  import Box from '@lucide/svelte/icons/box'

  let { name }: { name: string } = $props()
</script>

<div class="asset-item">
  <div class="asset-icon">
    <Box size="48" />
  </div>
  <div class="asset-name">
    {name}
  </div>
</div>

<style>
  .asset-item {
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
  }

  .asset-item:hover {
    background: var(--bg-hover);
  }

  .asset-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--bg-base);
    border-radius: 6px;
    border: 1px solid var(--border-color);
    padding: 3px;
  }

  .asset-name {
    font-size: 11px;
    text-align: center;
    word-break: break-all;
  }
</style>
