<script lang="ts">
  let {
    onresize,
    direction = 'vertical'
  }: { onresize: (delta: number) => void; direction?: 'vertical' | 'horizontal' } = $props()

  const onmousemove = (ev: MouseEvent): void => {
    const movement = direction === 'vertical' ? ev.movementX : ev.movementY
    onresize(movement)
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

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="splitter"
  class:horizontal={direction === 'horizontal'}
  role="separator"
  aria-orientation={direction}
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

  .splitter.horizontal {
    margin: -2px 0;
    cursor: row-resize;
  }

  .splitter:hover {
    background-color: var(--accent);
  }
</style>
