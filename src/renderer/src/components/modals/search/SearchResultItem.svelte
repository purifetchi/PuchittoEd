<script lang="ts">
  import Box from '@lucide/svelte/icons/box'
  import type { SearchItem } from '../../../state/searchState.svelte'

  let {
    item,
    selected,
    index,
    onhover,
    onclick
  }: {
    item: SearchItem
    selected: boolean
    index: number
    onhover: (index: number) => void
    onclick: (index: number) => void
  } = $props()

  const onmouseover = (ev: MouseEvent): void => {
    ev.preventDefault()

    onhover(index)
  }

  const onmousedown = (ev: MouseEvent): void => {
    ev.preventDefault()

    onclick(index)
  }

  const onfocus = (ev: FocusEvent): void => {
    ev.preventDefault()

    onhover(index)
  }
</script>

<button type="button" class="search-item" {onfocus} {onmouseover} {onmousedown} class:selected>
  <Box size="14" />
  <span class="name">
    {item.name}
  </span>

  {#if item.info !== undefined}
    <span class="type">
      {item.info}
    </span>
  {/if}
</button>

<style>
  .search-item {
    display: flex;
    align-items: center;
    text-align: left;
    width: 100%;
    font-size: inherit;
    font-family: inherit;

    gap: 9px;
    padding: 6px 9px;
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: var(--text-muted);
  }

  .search-item:focus {
    outline: none;
  }

  .search-item.selected {
    background: var(--accent) !important;
    color: var(--text-main) !important;
  }

  .search-item.selected .type {
    color: var(--text-main) !important;
  }

  .name {
    flex: 1;
    color: var(--text-main);
  }

  .type {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }
</style>
