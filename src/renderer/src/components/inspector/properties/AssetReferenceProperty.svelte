<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import AssetThumbnail from '../../assets/AssetThumbnail.svelte'
  import Chevron from '@lucide/svelte/icons/chevrons-up-down'
  import Image from '@lucide/svelte/icons/image'
  import { recordCommand } from '../../../editor/systems/history/editorHistory'
  import { EntityPropertyChangedCommand } from '../../../editor/systems/history/commands/entityPropertyChangedCommand'
  import { openAssetSearch } from '../../../editor/helpers/searchHelpers'
  import type { FileFormat } from '../../../editor/helpers/formatHelpers'

  let {
    name,
    obj,
    path,
    hints
  }: { name: string; obj: GameObject; path: string; hints?: Record<string, unknown> } = $props()

  let asset = $state('')
  let accessor: () => string
  let setter: (value: string) => void

  let droppable = $state(false)

  const isEmpty = $derived(asset === undefined || asset === '')

  let ondrop = (ev: DragEvent): void => {
    ev.preventDefault()
    const data = ev.dataTransfer.getData('x-puchitto/asset')
    if (data !== '' && data !== undefined) {
      asset = data
    }

    droppable = false
  }

  let ondragenter = (ev: DragEvent): void => {
    const isAsset = ev.dataTransfer.types.includes('x-puchitto/asset')
    if (isAsset) {
      droppable = true
    }

    ev.preventDefault()
  }

  let ondragover = (ev: DragEvent): void => {
    ev.preventDefault()
  }

  let ondragleave = (): void => {
    droppable = false
  }

  const onclick = (): void => {
    const forcedGroupHint = hints?.['type'] as FileFormat | undefined
    openAssetSearch(forcedGroupHint).then((selected) => {
      asset = selected
    })
  }

  const onkeydown = (ev: KeyboardEvent): void => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault()
      onclick()
    }
  }

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: string) => (obj[path] = value)

    asset = accessor()
  })

  $effect(() => {
    const previous = accessor()

    if (previous !== asset) {
      recordCommand(new EntityPropertyChangedCommand(obj, name, previous, asset))
      setter(asset)
    }
  })
</script>

<Property label={name}>
  <div
    class="reference-field"
    class:droppable
    role="button"
    tabindex="0"
    aria-label={name}
    {onclick}
    {onkeydown}
    {ondrop}
    {ondragenter}
    {ondragover}
    {ondragleave}
  >
    <span class="icon">
      {#if isEmpty}
        <Image size="12" />
      {:else}
        <AssetThumbnail filename={asset} size={12} />
      {/if}
    </span>
    <span class="value" class:empty={isEmpty}>
      {#if !isEmpty}
        {asset}
      {:else}
        No asset
      {/if}
    </span>
    <Chevron size="14" />
  </div>
</Property>

<style>
  .reference-field {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;

    min-width: 0;
    background: var(--bg-base);
    border: 1px solid var(--border-color);
    border-radius: 3px;

    padding: 2px 6px 2px 3px;
    min-height: 26px;
    cursor: pointer;
    position: relative;
  }

  .reference-field.droppable {
    outline: 1px solid var(--accent-hover) !important;
  }

  .reference-field.error {
    color: var(--error);
    border: 1px solid var(--error);
  }

  .reference-field:hover {
    border: 1px solid var(--border-light);
  }

  .reference-field .icon {
    width: 20px;
    height: 20px;

    background: var(--bg-deep);
    border: 1px solid var(--border-color);
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .reference-field .value {
    flex: 1;
    font-size: 12px;
    color: var(--accent-hover);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-family: var(--font-mono);
  }

  .reference-field .value.empty {
    color: var(--text-muted) !important;
    font-style: italic;

    font-family: inherit;
  }
</style>
