<script lang="ts">
  let { width = 70, children, ...rest } = $props()
</script>

<span class="label" style={`width: ${width}px`} {...rest}>
  {@render children()}
</span>

<style>
  .label {
    color: var(--text-muted);
  }
</style>
