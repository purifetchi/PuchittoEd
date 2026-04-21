<script lang="ts">
  let { value = $bindable(), ...rest } = $props()
</script>

<input bind:value {...rest} />

<style>
  input {
    flex: 1;
    background: var(--bg-base);
    border: 1px solid var(--border-color);
    color: var(--text-light);
    padding: 4px 8px;
    border-radius: 3px;
    outline: none;
  }
</style>
