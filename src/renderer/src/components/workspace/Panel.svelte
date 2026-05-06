<script lang="ts">
  let { flex = 0.3, children } = $props()
</script>

<div class="workspace-container" style:flex>
  {@render children()}
</div>

<style>
  .workspace-container {
    background-color: var(--bg-panel);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
</style>
