<script lang="ts">
  import type { Component } from 'svelte'

  let {
    tabs,
    value,
    onchange,
    splits = 'bottom'
  }: {
    tabs: {
      value: string
      name: string
      icon: Component
    }[]
    value: string
    onchange: (value: string) => void
    splits?: 'bottom' | 'top'
  } = $props()
</script>

<div class="tabs" class:top={splits === 'top'} class:bottom={splits === 'bottom'}>
  {#each tabs as tab (tab.name)}
    <button class="tab" class:active={tab.value === value} onclick={() => onchange(tab.value)}>
      <span class="icon">
        <tab.icon size="14" />
      </span>
      {tab.name}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    align-items: stretch;
    flex-shrink: 0;
    height: 26px;
    background: var(--bg-header);
  }

  .tabs.bottom {
    border-bottom: 1px solid var(--border-color);
  }

  .tabs.top {
    border-top: 1px solid var(--border-color);
  }

  .tabs .tab {
    display: flex;
    text-align: left;
    align-items: center;
    vertical-align: middle;
    font: inherit;

    gap: 6px;
    padding: 0 14px;
    font-size: 12px;
    cursor: pointer;
    position: relative;

    background: inherit;
    color: var(--text-muted);
    border: none;
    border-right: 1px solid var(--border-color);
  }

  .tabs .tab .icon {
    display: flex;
    align-items: center;
  }

  .tab.active {
    background: var(--bg-deep) !important;
    color: white !important;
  }

  .tab.active::after {
    content: '';
    position: absolute;

    width: 100%;
    height: 2px;
    left: 0;
    bottom: -1px;
    background: var(--accent-hover);
  }

  .tabs .tab:hover {
    background: var(--bg-hover);
    color: var(--text-main);
  }
</style>
