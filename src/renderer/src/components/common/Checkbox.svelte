<script lang="ts">
  let { checked = $bindable(true) }: { checked?: boolean } = $props()
</script>

<div class="checkbox-wrapper">
  <input type="checkbox" bind:checked />
</div>

<style>
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .checkbox-wrapper input {
    accent-color: var(--accent);
    width: 14px;
    height: 14px;
  }
</style>
