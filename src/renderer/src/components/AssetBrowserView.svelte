<script lang="ts">
  import { onMount } from 'svelte'
  import { assetBrowserState, assetsInFolder, type AssetNode } from '../state/assetState.svelte'
  import AssetItem from './assets/AssetItem.svelte'
  import Back from '@lucide/svelte/icons/chevron-left'
  import Next from '@lucide/svelte/icons/chevron-right'
  import Folder from '@lucide/svelte/icons/folder'

  let folderStack: string[] = $state([''])
  let currentFolder = $derived(folderStack.join('/'))
  let assets = $derived(assetsInFolder(assetBrowserState.assets, currentFolder))

  const back = (): void => {
    if (folderStack.length > 1) {
      folderStack.pop()
    }
  }

  const goto = (idx: number): void => {
    folderStack = folderStack.slice(0, idx)
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
  <div class="header">
    <button class="icon-button" onclick={back}>
      <Back size="16" />
    </button>
    <div class="separator"></div>
    <div class="breadcrumbs">
      {#each folderStack as crumb, i (i)}
        {@const name = i === 0 ? 'Assets' : crumb}
        <button
          class="crumb"
          class:current={i === folderStack.length - 1}
          onclick={() => goto(i + 1)}
        >
          <Folder size="13" />
          {name}
        </button>
        {#if i !== folderStack.length - 1}
          <span class="to">
            <Next size="12" />
          </span>
        {/if}
      {/each}
    </div>
  </div>
  <div class="assets">
    {#each assets as asset, i (i)}
      <AssetItem node={asset} {onAssetSelected} />
    {/each}
  </div>
</div>

<style>
  .asset-browser {
    height: 320px;
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    align-items: center;
    background: var(--bg-header);
    gap: 4px;
    padding: 4px 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .header .separator {
    width: 1px;
    height: 18px;
    background: var(--border-color);
    margin: 0 4px;
    flex: none;
  }

  .header .breadcrumbs {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 2px;

    overflow-x: auto;
    scrollbar-width: none;
    flex: 1;
    min-width: 0;

    white-space: nowrap;
  }

  .header .breadcrumbs .to {
    color: var(--border-light);
    flex: none;
  }

  .header .breadcrumbs .crumb {
    flex: none;
    display: flex;
    align-items: center;
    gap: 5px;

    border: none;
    background: transparent;
    color: var(--text-muted);

    font: inherit;
    padding: 3px 7px;
    border-radius: 4px;
    cursor: pointer;
  }

  .header .breadcrumbs .crumb:hover {
    background: var(--bg-hover);
    color: var(--text-main);
  }

  .header .breadcrumbs .crumb.current {
    color: white;
    font-weight: 600;
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 26px;
    height: 26px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--text-main);
    cursor: pointer;

    flex: none;
  }

  .icon-button:hover {
    background: var(--bg-hover);
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
