<script lang="ts">
  import { assetBrowserState } from '../state/assetState.svelte'
  import AssetItem from './assets/AssetItem.svelte'

  let assets = $derived(assetBrowserState.assets)
</script>

<div class="asset-browser">
  {#each assets as asset, i (i)}
    <AssetItem name={asset} />
  {/each}
</div>

<style>
  .asset-browser {
    display: grid;
    overflow-y: scroll;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 15px;
    flex: 0.35;
    border-top: 1px solid var(--border-color);
  }
</style>
