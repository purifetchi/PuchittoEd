<script lang="ts">
</script>

<div class="part-header">
  <slot name="icon"></slot>
  <slot name="name"></slot>
</div>

<style>
  :root {
    --border-color: #3f3f4655;
  }

  .part-header {
    padding: 8px 10px;
    background: var(--bg-hover);
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }
</style>
