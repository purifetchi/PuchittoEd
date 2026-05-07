<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import Box from '@lucide/svelte/icons/box'
  import Circle from '@lucide/svelte/icons/circle'
  import Input from '../../common/Input.svelte'
  import AssetThumbnail from '../../assets/AssetThumbnail.svelte'

  let { name, obj, path }: { name: string; obj: GameObject; path: string } = $props()

  let asset = $state('')
  let accessor: () => string
  let setter: (value: string) => void

  let droppable = $state(false)

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
    console.log('left..')
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
    <AssetThumbnail filename={asset} size={22} />
  </div>
  <Input
    bind:value={asset}
    readonly
    placeholder="Missing asset."
    style="color: var(--accent); cursor: pointer; font-family: var(--font-mono); text-overflow: ellipsis;"
    class={droppable ? 'droppable' : ''}
    {ondrop}
    {ondragenter}
    {ondragover}
    {ondragleave}
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
