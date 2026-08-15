<script lang="ts">
  import {
    joinCssBackgroundLayers,
    type CssBackgroundLayer
  } from '../../../editor/helpers/backgroundLayerHelpers'
  import Menu from '@lucide/svelte/icons/menu'
  import AssetReferenceProperty from '../properties/AssetReferenceProperty.svelte'

  let { layer, onchanged }: { layer: CssBackgroundLayer; onchanged: () => void } = $props()

  let swatch: HTMLSpanElement = $state()
  let hidden: boolean = $state(true)

  let description = $derived(layer.type === 'image' ? `${layer.asset}` : `<unknown>`)

  const toggle = (): void => {
    hidden = !hidden
  }

  const onkeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  $effect(() => {
    swatch.style.background = joinCssBackgroundLayers([layer])
    onchanged()
  })
</script>

<div class="layer">
  <div
    class="layer-head"
    role="button"
    tabindex="0"
    aria-expanded={!hidden}
    aria-controls="layer-body"
    onclick={toggle}
    {onkeydown}
  >
    <span class="handle" draggable="true">
      <Menu size="13" />
    </span>
    <span class="swatch" bind:this={swatch}></span>
    <span class="layer-summary">
      <span class="kind">{layer.type}</span>
      <span class="desc">{description}</span>
    </span>
  </div>
  <div id="layer-body" class="layer-body" class:hidden>
    {#if layer.type === 'image'}
      <!-- TODO: Obj points to a GameObject but we are not a gameobject! Needs a refactor -->
      <AssetReferenceProperty
        name="Asset"
        obj={layer}
        path="asset"
        hints={{
          type: 'texture',
          prefix: 'asset://'
        }}
      />
    {:else if layer.type === 'unknown'}
      <div>unknown layer {layer.data}</div>
    {/if}
  </div>
</div>

<style>
  .layer {
    border: 1px solid var(--border-color);
    border-radius: 3px;
    background: var(--bg-base);
    overflow: hidden;
  }

  .layer-head {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 4px;
    cursor: pointer;
  }

  .layer-body {
    display: flex;
    flex-direction: column;
    padding: 7px 8px;

    border-top: 1px solid var(--border-color);
    gap: 6px;
    background: var(--bg-panel);
  }

  .layer-body.hidden {
    display: none !important;
  }

  .layer-summary {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    line-height: 1.25;
  }

  .handle {
    color: var(--border-light);
    cursor: grab;
    display: flex;
    flex: none;
    padding: 0 1px;
  }

  .swatch {
    width: 26px;
    height: 22px;
    flex: none;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    position: relative;
  }

  .kind {
    font-size: 11px;
    color: var(--text-light);
  }

  .desc {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--accent-hover);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
