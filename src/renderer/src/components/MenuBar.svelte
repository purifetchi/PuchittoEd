<script lang="ts">
  import { onMount } from 'svelte'
  import { editor } from '../editor/editorGame'
  import DropdownButton from './menu/DropdownButton.svelte'
  import DropdownSeparator from './menu/DropdownSeparator.svelte'
  import MenuBarItem from './menu/MenuBarItem.svelte'
  import { projectState } from '../state/projectState.svelte'
  import { afterEditorReady } from '../editor/helpers/loadHelpers'
  import { getToolTree, type ToolTreeNode } from '../editor/systems/hotkey/hotkeyToolRegistrar'
  import RecursiveMenuButton from './menu/RecursiveMenuButton.svelte'

  let tree: ToolTreeNode = $state()

  const newLevel = async (): Promise<void> => {
    const selected = await window.puchittoAPI.selectNewProjectFolder()

    if (selected) {
      afterEditorReady(async () => {
        editor.newScene()
      })
    }
  }

  const loadLevel = async (): Promise<void> => {
    const selected = await window.puchittoAPI.selectProject()
    if (selected) {
      afterEditorReady(async () => {
        await editor.loadLevel()
      })
    }
  }

  const saveLevel = async (): Promise<void> => {
    await editor.saveLevel()
  }

  const exportLevel = async (): Promise<void> => {
    await editor.exportLevel()
  }

  const about = (): void => {
    alert('PuchittoEd! todo...')
  }

  const exit = (): void => {
    window.close()
  }



  onMount(() => {
    window.puchittoAPI.onProjectSelected((path) => {
      projectState.project = path
      document.title = `PuchittoEd - ${path}`
    })

    tree = getToolTree()
  })
</script>

<header class="menu-bar">
  <MenuBarItem label="File">
    <DropdownButton clicked={newLevel}>New realm</DropdownButton>
    <DropdownButton clicked={loadLevel}>Load realm</DropdownButton>
    <DropdownButton clicked={saveLevel}>Save realm</DropdownButton>
    <DropdownSeparator />
    <DropdownButton clicked={exportLevel}>Export realm as ALF</DropdownButton>
    <DropdownSeparator />
    <DropdownButton clicked={exit}>Exit</DropdownButton>
  </MenuBarItem>

  {#if tree !== undefined && 'children' in tree}
    {#each tree.children as node (node.name)}
      <RecursiveMenuButton {node} />
    {/each}
  {/if}

  <MenuBarItem label="About">
    <DropdownButton clicked={about}>About PuchittoEd</DropdownButton>
  </MenuBarItem>
</header>

<style>
  .menu-bar {
    height: 28px;
    background-color: var(--bg-header);
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--bg-deep);
  }
</style>
