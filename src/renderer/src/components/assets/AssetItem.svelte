<script lang="ts">
  import type { AssetNode } from '../../state/assetState.svelte'
  import AssetThumbnail from './AssetThumbnail.svelte'
  import Folder from '@lucide/svelte/icons/folder'

  let { node, onAssetSelected }: { node: AssetNode; onAssetSelected: (node: AssetNode) => void } =
    $props()

  const onclick = (): void => {
    onAssetSelected(node)
  }

  const onkeydown = (): void => {}

  let ondragstart = (ev: DragEvent): void => {
    ev.dataTransfer.setData('x-puchitto/asset', node.path)
  }
</script>

<div
  class="asset-item"
  role="gridcell"
  tabindex="0"
  {ondragstart}
  {onclick}
  {onkeydown}
  draggable="true"
>
  {#if node.kind === 'file'}
    <div class="asset-icon bg">
      <AssetThumbnail filename={node.path} size={48} />
    </div>
  {:else}
    <div class="asset-icon">
      <Folder size="48" />
    </div>
  {/if}
  <div class="asset-name">
    {node.name}
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
    border-radius: 6px;
    padding: 3px;
  }

  .asset-icon.bg {
    background: var(--bg-base);
    border: 1px solid var(--border-color);
  }

  .asset-name {
    font-size: 11px;
    text-align: center;
    word-break: break-all;
  }
</style>
