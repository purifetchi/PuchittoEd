<script lang="ts">
  import { editor } from "../editor/editorGame"

  const newLevel = () => {
    editor.newScene()
  }

  const loadLevel = async () => {
    const data = await window.puchittoAPI.readFile()
    editor.loadLevelFile(data)
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
