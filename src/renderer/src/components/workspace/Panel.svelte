<script lang="ts">
  let { flex = 0.3 } = $props()
</script>

<div class="workspace-container" style:flex={flex}>
  <slot></slot>
</div>

<style>
  .workspace-container {
    background-color: var(--bg-panel);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
  }
</style>
