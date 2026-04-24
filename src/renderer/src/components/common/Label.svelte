<script lang="ts">
  let { width = 70, ...rest } = $props()
</script>

<span class="label" style={`width: ${width}px`} {...rest}>
  <slot />
</span>

<style>
  .label {
    color: var(--text-muted);
  }
</style>
