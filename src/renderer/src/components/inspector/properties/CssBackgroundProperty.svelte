<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import { recordCommand } from '../../../editor/systems/history/editorHistory'
  import { EntityPropertyChangedCommand } from '../../../editor/systems/history/commands/entityPropertyChangedCommand'
  import {
    joinCssBackgroundLayers,
    parseCssBackgroundLayers,
    type CssBackgroundLayer
  } from '../../../editor/helpers/backgroundLayerHelpers'
  import { untrack } from 'svelte'
  import CssBackgroundLayerProperty from '../css/CssBackgroundLayerProperty.svelte'
  import Plus from '@lucide/svelte/icons/plus'

  let { name, obj, path }: { name: string; obj: GameObject; path: string } = $props()

  let bgDisplay: HTMLDivElement = $state()

  let open: boolean = $state(false)
  let value: CssBackgroundLayer[] = $state([])
  let accessor: () => string
  let setter: (value: string) => void

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: string) => (obj[path] = value)
  })

  $effect(() => {
    value = parseCssBackgroundLayers(accessor())

    untrack(() => {
      bgDisplay.style.background = joinCssBackgroundLayers(value)
    })
  })

  const onchanged = (): void => {
    const newValue = joinCssBackgroundLayers(value)

    bgDisplay.style.background = newValue
    recordCommand(new EntityPropertyChangedCommand(obj, path, newValue, value))
    setter(newValue)
  }

  const addLayer = (type: string): void => {
    switch (type) {
      case 'image':
        value.push({
          type: 'image',
          asset: ''
        })
        break

      default:
        console.error(`Invalid layer type ${type}`)
        break
    }

    open = false
  }
</script>

<Property label={name}>
  <div class="editor-container">
    <div class="bg-display" bind:this={bgDisplay}>
      <div class="bg-layers">{value.length} layer(s)</div>
    </div>
    <div class="layers">
      {#each value as layer, i (i)}
        <CssBackgroundLayerProperty {layer} {onchanged} />
      {/each}
    </div>
    <div class="add-layer">
      <button class="add-btn" onclick={() => (open = !open)}>
        <Plus size="16" />
        <span class="add-btn-name"> Add Layer </span>
      </button>
      <div class="add-menu" class:open>
        <button class="add-menu-btn" onclick={() => addLayer('image')}>Image</button>
        <button class="add-menu-btn" onclick={() => addLayer('color')}>Color</button>
      </div>
    </div>
  </div>
</Property>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .bg-display {
    height: 96px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  .bg-layers {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-main);
    padding: 2px 6px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.55);
  }

  .add-layer {
    position: relative;
  }

  .add-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--bg-base);
    border: 1px dashed var(--border-color);
    color: var(--text-muted);
    font: inherit;
    font-size: 11px;
    padding: 5px;
    border-radius: 3px;
    cursor: pointer;
  }

  .add-btn:hover {
    background: var(--bg-hover);
  }

  .add-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(100% + 3px);
    background: var(--bg-header);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 3px;
    z-index: 5;
  }

  .add-menu-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    background: transparent;
    font: inherit;
    color: var(--text-main);
    font-size: 12px;
    padding: 5px 7px;
    border-radius: 3px;
    cursor: pointer;
    text-align: left;
    border: none;
  }

  .add-menu-btn:hover {
    background: var(--bg-hover);
  }

  .add-menu.open {
    display: flex;
  }
</style>
