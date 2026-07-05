<script lang="ts">
  import Move from '@lucide/svelte/icons/move-3d'
  import Rotate from '@lucide/svelte/icons/rotate-3d'
  import Scale from '@lucide/svelte/icons/scale-3d'

  import World from '@lucide/svelte/icons/globe'
  import Object from '@lucide/svelte/icons/box'
  import type { Space, Tool } from '../../editor/entities/transformsObject'
  import { transformsState } from '../../state/transformsState.svelte'
  import { projectState } from '../../state/projectState.svelte'

  let setTool = (tool: Tool): void => {
    transformsState.tool = tool
  }

  let setSpace = (space: Space): void => {
    transformsState.space = space
  }
</script>

<div class="toolbar" class:visible={projectState.viewMode === 'editor'}>
  <button
    class="tool-button"
    class:active={transformsState.tool === 'position'}
    title="Move"
    onclick={() => setTool('position')}
  >
    <Move size="16" />
  </button>
  <button
    class="tool-button"
    class:active={transformsState.tool === 'rotation'}
    title="Rotate"
    onclick={() => setTool('rotation')}
  >
    <Rotate size="16" />
  </button>
  <button
    class="tool-button"
    class:active={transformsState.tool === 'scale'}
    title="Scale"
    onclick={() => setTool('scale')}
  >
    <Scale size="16" />
  </button>
  <div class="tool-divider"></div>
  <button
    class="tool-button active"
    class:active={transformsState.space === 'world'}
    title="World-space positioning"
    onclick={() => setSpace('world')}
  >
    <World size="16" />
  </button>
  <button
    class="tool-button"
    class:active={transformsState.space === 'local'}
    title="Local-space positioning"
    onclick={() => setSpace('local')}
  >
    <Object size="16" />
  </button>
</div>

<style>
  .toolbar {
    display: none;

    position: absolute;
    top: 20px;
    left: 20px;
    background: var(--bg-header);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 4px;
    gap: 2px;
    align-items: center;

    z-index: 999;
  }

  .toolbar.visible {
    display: flex;
  }

  .tool-button {
    background: transparent;
    border: none;
    color: var(--text-main);
    padding: 6px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .tool-button:hover {
    background: var(--bg-hover);
  }

  .active {
    background: var(--bg-active);
    color: var(--text-light);
  }

  .active:hover {
    background: var(--accent);
  }

  .tool-divider {
    width: 1px;
    background: var(--border-color);
    margin: 2px 6px;
    align-self: stretch;
  }
</style>
