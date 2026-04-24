<script lang="ts">
  let { value = $bindable(), values = $bindable([]), ...rest } = $props()
</script>

<select bind:value {...rest}>
  {#each values as value (value)}
    <option>{value}</option>
  {/each}
</select>

<style>
  select {
    flex: 1;
    background: var(--bg-base);
    border: 1px solid var(--border-color);
    color: var(--text-light);
    padding: 4px 8px;
    border-radius: 3px;
    outline: none;
  }
</style>
