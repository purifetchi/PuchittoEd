<script lang="ts">
  import { onMount } from 'svelte'
  import Property from './Property.svelte'

  let { name, accessor } = $props()

  let x = $state(0.0)
  let y = $state(0.0)
  let z = $state(0.0)

  onMount(() => {
    const vec = accessor()
    x = vec.x
    y = vec.y
    z = vec.z
    $effect(() => {
      const vec = accessor()
      x = vec.x
      y = vec.y
      z = vec.z
    })
  })
</script>

<Property label={name}>
  <svelte:fragment slot="group">
    <div class="number-group">
      <div class="number-label x">X</div>
      <input class="number-input" type="text" bind:value={x} />
    </div>
    <div class="number-group">
      <div class="number-label y">Y</div>
      <input class="number-input" type="text" bind:value={y} />
    </div>
    <div class="number-group">
      <div class="number-label z">Z</div>
      <input class="number-input" type="text" bind:value={z} />
    </div>
  </svelte:fragment>
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
