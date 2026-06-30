<script lang="ts">
  import { editor } from '../../editor/editorGame'
  import type { ToolTreeNode } from '../../editor/systems/hotkey/hotkeyToolRegistrar'
  import DropdownButton from './DropdownButton.svelte'
  import MenuBarItem from './MenuBarItem.svelte'
  import RecursiveMenuButton from './RecursiveMenuButton.svelte'

  let { node }: { node: ToolTreeNode } = $props()

  const invokeTool = (toolName: string): void => {
    editor.invokeEditorTool(toolName)
  }
</script>

{#if 'children' in node}
  <MenuBarItem label={node.name}>
    {#each node.children as child (child.name)}
      <RecursiveMenuButton node={child} />
    {/each}
  </MenuBarItem>
{:else}
  <DropdownButton clicked={() => invokeTool(node.toolName)}>{node.name}</DropdownButton>
{/if}
