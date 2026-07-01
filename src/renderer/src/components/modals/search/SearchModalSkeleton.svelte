<script lang="ts">
  import Search from '@lucide/svelte/icons/search'
  import { searchState, type SearchItem } from '../../../state/searchState.svelte'
  import SearchResultItem from './SearchResultItem.svelte'

  let { close } = $props()

  let searchTerm: string = $state('')
  let selected = $state(0)
  let input: HTMLInputElement

  let filteredResults: SearchItem[] = $state([])

  $effect(() => {
    input.focus()
  })

  $effect(() => {
    selected = 0

    if (searchTerm.length === 0) {
      filteredResults = searchState.state.items
      return
    }

    // TODO: Fuzzy find.
    filteredResults = searchState.state.items.filter(
      (i) => i.name.indexOf(searchTerm) > -1 || i.info.indexOf(searchTerm) > -1
    )
  })

  const onkeydown = (ev: KeyboardEvent): void => {
    if (ev.key === 'Enter') {
      close(searchState.state.items[selected].value)
      ev.preventDefault()
      return
    }

    if (ev.key === 'ArrowUp') {
      selected = Math.max(0, selected - 1)
      ev.preventDefault()
    } else if (ev.key === 'ArrowDown') {
      selected = Math.min(searchState.state.items.length - 1, selected + 1)
      ev.preventDefault()
    }
  }

  const onclick = (index: number): void => {
    close(searchState.state.items[index].value)
  }

  const onhover = (index: number): void => {
    selected = index
  }
</script>

<div class="search-container" role="dialog">
  <div class="search-box">
    <Search size="15" />
    <input type="text" placeholder="Search" {onkeydown} bind:this={input} bind:value={searchTerm} />
  </div>
  <div class="search-items" role="list">
    {#if searchState.state !== undefined}
      {#each filteredResults as item, index (index)}
        <SearchResultItem {item} {index} {onhover} {onclick} selected={selected == index} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .search-container {
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    height: fit-content;
    overflow: hidden;
    width: 440px;
  }

  .search-box {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 11px 13px;
  }

  input {
    background: var(--bg-panel);
    border: none;
    color: var(--text-light);
    flex: 1;
  }

  input:focus {
    outline: none;
  }

  .search-box {
    border-bottom: 1px solid var(--border-color);
  }

  .search-items {
    padding: 5px;
  }
</style>
