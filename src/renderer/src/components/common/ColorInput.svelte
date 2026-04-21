<script lang="ts">
  import Input from './Input.svelte'

  let { hex = $bindable('') }: { hex: string } = $props()
</script>

<div class="color-wrapper">
  <input class="color-picker" type="color" bind:value={hex} />
  <Input bind:value={hex} placeholder="#rrggbb" />
</div>

<style>
  .color-wrapper {
    display: flex;
    width: 100%;
    gap: 8px;
    align-items: center;
  }

  .color-picker {
    -webkit-appearance: none;
    appearance: none;

    width: 32px;
    height: 22px;

    border-radius: 3px;
    padding: 0;
    margin: 0;

    background: var(--bg-base);
    cursor: pointer;
  }
</style>
