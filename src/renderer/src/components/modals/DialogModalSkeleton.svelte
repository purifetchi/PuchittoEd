<script lang="ts">
  let { close, children } = $props()
</script>

<div class="window">
  {@render children()}
  <div class="final-row">
    <button onclick={close(true)}>OK</button>
  </div>
</div>

<style>
  .window {
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 18px;
    height: fit-content;
    overflow: hidden;
  }

  button {
    display: inline-flex;
    align-items: center;

    background: var(--bg-panel);
    padding: 6px 12px;
    color: var(--text-main);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
  }

  button:hover {
    background: var(--bg-hover);
  }

  .final-row {
    display: flex;
    justify-content: flex-end;
    gap: 7px;
  }
</style>
