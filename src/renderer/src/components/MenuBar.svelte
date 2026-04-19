<script lang="ts">
  import { editor } from '../editor/editorGame'
  import DropdownButton from './menu/DropdownButton.svelte'
  import DropdownSeparator from './menu/DropdownSeparator.svelte'
  import MenuBarItem from './menu/MenuBarItem.svelte'

  const newLevel = (): void => {
    editor.newScene()
  }

  const loadLevel = async (): Promise<void> => {
    const selected = await window.puchittoAPI.selectProject()
    if (selected) {
      editor.loadLevel()
    }
  }

  const about = (): void => {
    alert('PuchittoEd! todo...')
  }

  const exit = (): void => {
    window.close()
  }
</script>

<header class="menu-bar">
  <MenuBarItem label="File">
    <DropdownButton clicked={newLevel}>New</DropdownButton>
    <DropdownButton clicked={loadLevel}>Load</DropdownButton>
    <DropdownSeparator />
    <DropdownButton clicked={exit}>Exit</DropdownButton>
  </MenuBarItem>
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
