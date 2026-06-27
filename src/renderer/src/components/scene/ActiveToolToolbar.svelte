<script lang="ts">
  import { toolState } from '../../state/toolState.svelte'
</script>

{#if toolState.tool !== undefined}
  <div class="toolbar">{toolState.tool}</div>
{/if}

<style>
  .toolbar {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    background: var(--bg-header);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 4px;
    gap: 2px;
    align-items: center;

    z-index: 999;
  }
</style>
