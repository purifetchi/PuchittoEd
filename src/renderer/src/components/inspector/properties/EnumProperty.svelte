<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import Chevron from '@lucide/svelte/icons/chevron-down'
  import { recordCommand } from '../../../editor/systems/history/editorHistory'
  import { EntityPropertyChangedCommand } from '../../../editor/systems/history/commands/entityPropertyChangedCommand'

  let {
    name,
    obj,
    path,
    hints
  }: { name: string; obj: GameObject; path: string; hints: Record<string, unknown> | undefined } =
    $props()

  let value = $state('')
  let accessor: () => string
  let setter: (value: string) => void

  let valueName = $derived(value === undefined ? 'none' : value)

  let dropdownVisible = $state(false)

  const values: string[] = $derived((hints?.['values'] as string[]) ?? [])

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: string) => (obj[path] = value)

    value = accessor()
  })

  $effect(() => {
    const previous = accessor()

    if (previous !== value) {
      recordCommand(new EntityPropertyChangedCommand(obj, path, previous, value))
      setter(value)
    }
  })

  const onclick = (): void => {
    dropdownVisible = !dropdownVisible
  }

  const setValue = (val: string): void => {
    value = val
    dropdownVisible = false
  }
</script>

<Property label={name}>
  <button class="selector" aria-haspopup="listbox" {onclick}>
    <span class="value">{valueName}</span>
    <span class="chev">
      <Chevron size="12" />
    </span>
  </button>
  <div class="popup" role="listbox" class:visible={dropdownVisible}>
    {#if hints?.['allowNone']}
      <button
        class="option"
        class:on={value === undefined}
        onclick={() => {
          setValue(undefined)
        }}>none</button
      >
    {/if}
    {#each values as optionValue (optionValue)}
      <button
        class="option"
        class:on={value === optionValue}
        onclick={() => {
          setValue(optionValue)
        }}>{optionValue}</button
      >
    {/each}
  </div>
</Property>

<style>
  .selector {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    background: var(--bg-base);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    color: var(--text-light);
    padding: 4px 8px;
    cursor: pointer;
    font-family: var(--font-family);
    font-size: 13px;
    text-align: left;
  }

  .selector:hover {
    border: 1px solid var(--border-light);
  }

  .selector .value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .selector .chev {
    color: var(--text-muted);
  }

  .popup {
    position: absolute;
    top: calc(100% + 3px);
    left: 0;
    right: 0;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    padding: 4px;
    z-index: 20;

    display: none;
    flex-direction: column;
  }

  .popup.visible {
    display: flex;
  }

  .popup .option {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 100%;
    padding: 4px 8px;
    border-radius: 3px;
    background: transparent;
    border: none;
    color: var(--text-main);
    font-family: var(--font-family);
    font-size: 13px;
    cursor: pointer;
    text-align: left;
  }

  .popup .option.on {
    color: var(--text-light);
    background: var(--accent);
  }

  .popup .option:hover {
    background: var(--bg-hover);
  }

  .popup .option.on:hover {
    background: var(--accent-hover);
  }
</style>
