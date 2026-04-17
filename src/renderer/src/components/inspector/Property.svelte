<script lang="ts">
  import InspectorRow from './InspectorRow.svelte'

  let { label } = $props()
</script>

<InspectorRow>
  <div class="label">
    {label}
  </div>
  <div class="group">
    <slot name="group"></slot>
  </div>
</InspectorRow>

<style>
  .label {
    width: 70px;
    color: var(--text-muted);
  }

  .group {
    flex: 1;
    display: flex;
    gap: 5px;
  }
</style>
