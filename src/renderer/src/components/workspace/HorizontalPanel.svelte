<script lang="ts">
  let { flex = 0.3, height = undefined, children } = $props()
</script>

<div class="workspace-container" style:flex={height === undefined ? flex : `0 0 ${height}px`}>
  {@render children()}
</div>

<style>
  .workspace-container {
    background-color: var(--bg-panel);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
</style>
