<script lang="ts">
  import Search from '@lucide/svelte/icons/search'
  import { Fzf } from 'fzf'
  import { searchState, type SearchItem } from '../../../state/searchState.svelte'
  import SearchResultItem from './SearchResultItem.svelte'
  import SearchGroupPill from './SearchGroupPill.svelte'

  let { close } = $props()

  let searchTerm: string = $state('')
  let selectedGroup: string | undefined = $state(searchState.state?.lockedGroup)
  let selected = $state(0)
  let input: HTMLInputElement

  const eligibleItems = $derived(
    selectedGroup !== undefined
      ? searchState.state.items.filter((i) => i.group == selectedGroup)
      : searchState.state.items
  )
  let filteredResults: SearchItem[] = $state([])

  $effect(() => {
    input.focus()
  })

  const fzf = $derived(
    new Fzf(eligibleItems, {
      selector: (item) => `${item.name} ${item.info}`
    })
  )

  $effect(() => {
    selected = 0

    if (searchTerm.length === 0) {
      filteredResults = eligibleItems
      return
    }

    filteredResults = fzf.find(searchTerm).map((f) => f.item)
  })

  const onkeydown = (ev: KeyboardEvent): void => {
    if (ev.key === 'Enter') {
      close(filteredResults[selected].value)
      ev.preventDefault()
      return
    }

    if (ev.key === 'ArrowUp') {
      selected = Math.max(0, selected - 1)
      ev.preventDefault()
    } else if (ev.key === 'ArrowDown') {
      selected = Math.min(filteredResults.length - 1, selected + 1)
      ev.preventDefault()
    }
  }

  const onclick = (index: number): void => {
    close(filteredResults[index].value)
  }

  const onhover = (index: number): void => {
    selected = index
  }

  const onfilterchanged = (filter?: string): void => {
    if (filter === undefined || filter === 'all') {
      selectedGroup = undefined
    } else {
      selectedGroup = filter
    }
  }
</script>

<div class="search-container" role="dialog">
  <div class="search-box">
    <Search size="15" />
    <input type="text" placeholder="Search" {onkeydown} bind:this={input} bind:value={searchTerm} />
  </div>
  {#if searchState.state?.groups !== undefined}
    <div class="groups">
      {#if searchState.state.lockedGroup !== undefined}
        <SearchGroupPill name={searchState.state.lockedGroup} {onfilterchanged} selected locked />
      {:else}
        <SearchGroupPill
          name="all"
          selected={selectedGroup === undefined}
          {onfilterchanged}
          locked={false}
        />
        {#each searchState.state.groups as group (group)}
          <SearchGroupPill
            name={group}
            selected={group === selectedGroup}
            {onfilterchanged}
            locked={false}
          />
        {/each}
      {/if}
    </div>
  {/if}
  <div class="search-items" role="list">
    {#if searchState.state !== undefined && filteredResults.length > 0}
      {#each filteredResults as item, index (index)}
        <SearchResultItem {item} {index} {onhover} {onclick} selected={selected == index} />
      {/each}
    {:else}
      <div class="empty">
        <div class="glass">
          <Search size="20" />
        </div>
        <div>no items found</div>
      </div>
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
    max-height: 50vh;

    display: flex;
    flex-direction: column;
  }

  .groups {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    padding: 7px 13px;
    border-bottom: 1px solid var(--border-color);
  }

  .search-box {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 11px 13px;
    border-bottom: 1px solid var(--border-color);
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

  .search-items {
    padding: 5px;

    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .search-items .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 15px;

    font-size: 11px;

    color: var(--text-muted);
  }

  .search-items .empty .glass {
    opacity: 0.4;
  }
</style>
