<script lang="ts">
  let { label }: { label: string } = $props()
</script>

<div class="menu-item">
  {label}
  <div class="dropdown">
    <slot></slot>
  </div>
</div>

<style>
  .menu-item {
    padding: 4px 10px;
    cursor: pointer;
    border-radius: 4px;
    position: relative;
  }

  .menu-item:hover {
    background: var(--bg-hover);
  }

  .menu-item:hover .dropdown {
    display: flex;
  }

  .dropdown {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    min-width: 220px;
    z-index: 5;
    padding: 4px 0;
  }
</style>
