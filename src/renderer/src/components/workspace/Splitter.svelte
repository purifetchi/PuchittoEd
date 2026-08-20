<script lang="ts">
  let { onresize }: { onresize: (delta: number) => void } = $props()

  const onmousemove = (ev: MouseEvent): void => {
    onresize(ev.movementX)
  }

  const onmouseup = (): void => {
    document.body.style.userSelect = ''

    document.removeEventListener('mousemove', onmousemove)
    document.removeEventListener('mouseup', onmouseup)
  }

  const onmousedown = (): void => {
    document.body.style.userSelect = 'none'

    document.addEventListener('mousemove', onmousemove)
    document.addEventListener('mouseup', onmouseup)
  }
</script>

<div
  class="splitter"
  role="separator"
  aria-orientation="vertical"
  tabindex="-1"
  {onmousedown}
></div>

<style>
  .splitter {
    flex: 0 0 5px;
    margin: 0 -2px;
    z-index: 1;
    cursor: col-resize;
    background-color: transparent;
    transition: background-color 0.1s;
  }

  .splitter:hover {
    background-color: var(--accent);
  }
</style>
