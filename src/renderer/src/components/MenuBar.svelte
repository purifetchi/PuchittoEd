<script lang="ts">
  import { editor } from '../editor/editorGame'

  const newLevel = (): void => {
    editor.newScene()
  }

  const loadLevel = async (): Promise<void> => {
    const selected = await window.puchittoAPI.selectProject()
    if (selected) {
      editor.loadLevel()
    }
  }
</script>

<header class="menu-bar">
  <button onclick={newLevel}>new level</button>
  <button onclick={loadLevel}>load level</button>
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
