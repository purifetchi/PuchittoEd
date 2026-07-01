<script lang="ts">
  import Plus from '@lucide/svelte/icons/plus'
  import { editor } from '../../editor/editorGame'

  const onclick = (): void => {
    editor.invokeEditorTool('tool.createEntity')
  }
</script>

<button class="add-button" {onclick}>
  <Plus size="16" />
</button>

<style>
  .add-button {
    display: flex;
    align-items: center;
    margin-right: 10px;
    padding: 2px;
    border-radius: 4px;
    position: relative;
    background: inherit;
    border: none;
    color: var(--text-main);
    cursor: pointer;
  }

  .add-button:hover {
    background: var(--bg-hover);
  }
</style>
