<script lang="ts">
  import { untrack } from 'svelte'
  import type { Vector3Like } from 'three'
  import Property from '../Property.svelte'

  type Axis = 'x' | 'y' | 'z'

  let {
    name,
    accessor,
    setter
  }: {
    name: string
    accessor: () => Vector3Like
    setter: (x: number, y: number, z: number) => void
  } = $props()

  // svelte-ignore state_referenced_locally
  let x = $state(accessor().x)

  // svelte-ignore state_referenced_locally
  let y = $state(accessor().y)

  // svelte-ignore state_referenced_locally
  let z = $state(accessor().z)

  $effect(() => {
    const vec = accessor()
    x = vec.x
    y = vec.y
    z = vec.z
  })

  $effect(() => {
    const cx = x
    const cy = y
    const cz = z
    untrack(() => {
      setter(cx, cy, cz)
    })
  })

  let currentAxis: Axis = 'x'

  let listener = (e: MouseEvent): void => {
    switch (currentAxis) {
      case 'x':
        x += e.movementX * 0.1
        break
      case 'y':
        y += e.movementX * 0.1
        break
      case 'z':
        z += e.movementX * 0.1
        break
    }
  }

  let mousedown = (axis: Axis): void => {
    currentAxis = axis

    document.addEventListener('mousemove', listener)
    document.addEventListener('mouseup', mouseup)
  }

  let mouseup = (): void => {
    document.removeEventListener('mousemove', listener)
    document.removeEventListener('mouseup', mouseup)
  }
</script>

<Property label={name}>
  <div class="number-group">
    <div
      class="number-label x"
      role="slider"
      aria-valuenow={x}
      tabindex="0"
      onmousedown={() => mousedown('x')}
    >
      X
    </div>
    <input class="number-input" step="any" type="number" bind:value={x} />
  </div>
  <div class="number-group">
    <div
      class="number-label y"
      role="slider"
      aria-valuenow={y}
      tabindex="0"
      onmousedown={() => mousedown('y')}
    >
      Y
    </div>
    <input class="number-input" step="any" type="number" bind:value={y} />
  </div>
  <div class="number-group">
    <div
      class="number-label z"
      role="slider"
      aria-valuenow={z}
      tabindex="0"
      onmousedown={() => mousedown('z')}
    >
      Z
    </div>
    <input class="number-input" step="any" type="number" bind:value={z} />
  </div>
</Property>

<style>
  :root {
    --axis-x: #f44336;
    --axis-y: #4caf50;
    --axis-z: #2196f3;
  }

  .number-group {
    display: flex;
    flex: 1;
    background-color: var(--bg-base);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .number-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-light);
    padding: 4px 6px;
    font-family: var(--font-mono);
    font-size: 12px;
    width: 100%;
    outline: none;
  }

  .number-input::-webkit-outer-spin-button,
  .number-input::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
    margin: 0;
  }

  .number-label {
    width: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 10px;
    background-color: var(--bg-header);
  }

  .number-label:hover {
    cursor: w-resize;
  }

  .number-label.x {
    color: var(--axis-x);
  }

  .number-label.y {
    color: var(--axis-y);
  }

  .number-label.z {
    color: var(--axis-z);
  }
</style>
