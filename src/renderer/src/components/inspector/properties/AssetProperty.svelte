<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import Box from '@lucide/svelte/icons/box'
  import Circle from '@lucide/svelte/icons/circle'
  import Input from '../../common/Input.svelte'
  import { assetDragNDropState } from '../../../state/assetState.svelte'

  let { name, obj, path }: { name: string; obj: GameObject; path: string } = $props()

  let asset = $state('')
  let accessor: () => string
  let setter: (value: string) => void

  let droppable = $state(false)

  let mouseup = (): void => {
    if (assetDragNDropState.name !== '') {
      asset = assetDragNDropState.name
      assetDragNDropState.name = ''
      droppable = false
    }
  }

  let mouseenter = (): void => {
    if (assetDragNDropState.name !== '') {
      droppable = true
    }
  }

  let mouseleave = (): void => {
    if (assetDragNDropState.name !== '') {
      droppable = false
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
      setter(asset)
    }
  })
</script>

<Property label={name}>
  <div class="asset-thumb">
    <Box size="22" />
  </div>
  <Input
    bind:value={asset}
    readonly
    placeholder="Missing asset."
    style="color: var(--accent); cursor: pointer; font-family: var(--font-mono); text-overflow: ellipsis;"
    class={droppable ? 'droppable' : ''}
    onmouseup={mouseup}
    onmouseenter={mouseenter}
    onmouseleave={mouseleave}
  />
  <button class="icon-button" aria-label="Select an asset.">
    <Circle size="24" />
  </button>
</Property>

<style>
  .asset-thumb {
    width: 22px;
    height: 22px;
    background: var(--bg-deep);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  :global(.droppable) {
    outline: 1px solid var(--accent-hover) !important;
  }

  .icon-button {
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    color: var(--text-main);
  }
</style>
