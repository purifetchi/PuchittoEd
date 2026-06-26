<script lang="ts">
  import { onMount } from 'svelte'
  import { assetBrowserState } from '../state/assetState.svelte'
  import AssetItem from './assets/AssetItem.svelte'

  let assets = $derived(assetBrowserState.assets)

  let container: HTMLDivElement

  const ondrop = (ev: DragEvent): void => {
    ev.preventDefault()
    const fileItems = [...ev.dataTransfer!.items].filter((item) => item.kind === 'file')
    if (fileItems.length === 0) {
      return
    }
    const filePaths = fileItems.map((item) =>
      window.electron.webUtils.getPathForFile(item.getAsFile()!)
    )
    window.puchittoAPI.copyFilesToProject(filePaths)
  }

  const ondragover = (ev: DragEvent): void => {
    const fileItems = [...ev.dataTransfer.items].filter((item) => item.kind === 'file')
    if (fileItems.length > 0) {
      ev.preventDefault()
      ev.dataTransfer.dropEffect = 'copy'
    }
  }

  onMount(() => {
    container.addEventListener('drop', ondrop)
    container.addEventListener('dragover', ondragover)

    return () => {
      container.removeEventListener('drop', ondrop)
      container.removeEventListener('dragover', ondragover)
    }
  })
</script>

<div class="asset-browser" bind:this={container}>
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
