<script lang="ts">
  import { onMount } from 'svelte'
  import { assetBrowserState, assetsInFolder, type AssetNode } from '../state/assetState.svelte'
  import AssetItem from './assets/AssetItem.svelte'
  import PanelHeader from './workspace/PanelHeader.svelte'

  let folderStack: string[] = $state([''])
  let currentFolder = $derived(folderStack.join('\\'))
  let breadcrumbs = $derived(folderStack.join(' > '))
  let assets = $derived(assetsInFolder(assetBrowserState.assets, currentFolder))

  const back = (): void => {
    folderStack.pop()
  }

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

  const onAssetSelected = (node: AssetNode): void => {
    if (node.kind === 'folder') {
      folderStack.push(node.name)
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
  <PanelHeader>
    <button onclick={back}>back</button>
    {breadcrumbs}
  </PanelHeader>
  <div class="assets">
    {#each assets as asset, i (i)}
      <AssetItem node={asset} {onAssetSelected} />
    {/each}
  </div>
</div>

<style>
  .asset-browser {
    flex: 0.35;
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
  }

  .assets {
    flex: 1;

    min-height: 0;
    display: grid;
    overflow-y: auto;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 15px;
  }
</style>
