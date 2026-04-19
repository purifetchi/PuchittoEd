<script lang="ts">
  let { clicked }: { clicked: () => void | undefined } = $props()
</script>

<button class="dropdown-button" onclick={clicked}>
  <slot></slot>
</button>

<style>
  .dropdown-button {
    padding: 6px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    color: var(--text-main);
    cursor: pointer;
    font-size: 12px;
  }

  .dropdown-button:hover {
    background: var(--bg-active);
  }
</style>
