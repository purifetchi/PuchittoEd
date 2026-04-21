<script lang="ts">
  import Box from '@lucide/svelte/icons/box'
  import { assetDragNDropState } from '../../state/assetState.svelte'

  let { name }: { name: string } = $props()

  let listening = false
  let element: HTMLDivElement

  let onmousedown = (): void => {
    assetDragNDropState.name = name
    listening = true
    document.addEventListener('mouseup', onmouseup)

    setTimeout((): void => {
      if (!listening) {
        return
      }

      document.body.style.cursor = 'grabbing'
      element.style.position = 'fixed'
      element.style.pointerEvents = 'none'
      document.addEventListener('mousemove', onmousemove)
    }, 300)
  }

  let onmousemove = (ev: MouseEvent): void => {
    element.style.top = `${ev.clientY}px`
    element.style.left = `${ev.clientX}px`
  }

  let onmouseup = (): void => {
    listening = false
    element.style.position = null
    element.style.top = null
    element.style.left = null
    element.style.pointerEvents = null
    document.body.style.cursor = null

    assetDragNDropState.name = ''
    document.removeEventListener('mousemove', onmousemove)
    document.removeEventListener('mouseup', onmouseup)
  }
</script>

<div class="asset-item" role="gridcell" tabindex="0" bind:this={element} {onmousedown}>
  <div class="asset-icon">
    <Box size="48" />
  </div>
  <div class="asset-name">
    {name}
  </div>
</div>

<style>
  .asset-item {
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
  }

  .asset-item:hover {
    background: var(--bg-hover);
  }

  .asset-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--bg-base);
    border-radius: 6px;
    border: 1px solid var(--border-color);
    padding: 3px;
  }

  .asset-name {
    font-size: 11px;
    text-align: center;
    word-break: break-all;
  }
</style>
