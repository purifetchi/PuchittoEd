<script lang="ts">
  let { onclick } = $props()
</script>

<button class="icon-button" aria-label="Select an asset." {onclick}>
  <slot />
</button>

<style>
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
