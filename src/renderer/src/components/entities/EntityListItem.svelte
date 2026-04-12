<script lang="ts">
  import Box from '@lucide/svelte/icons/box'
  let { name, id, onselect, selected = false } = $props()
</script>

<button class="entity-list-item" class:selected onclick={() => onselect(id)}>
  <Box size={16} />
  <span class="name">
    { name }
  </span>
</button>

<style>
  .entity-list-item {
    background: none;
    border: none;
    color: var(--text-main);
    width: 100%;

    display: flex;
    align-items: center;
    padding: 5px;
    gap: 5px;
  }

  .entity-list-item:hover {
    background: var(--bg-hover);
    cursor: pointer;
  }

  .entity-list-item.selected {
    background: var(--bg-active);
  }
</style>
