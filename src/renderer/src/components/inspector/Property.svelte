<script lang="ts">
  import Label from '../common/Label.svelte'
  import InspectorRow from './InspectorRow.svelte'

  let { label }: { label: string } = $props()
</script>

<InspectorRow>
  <Label>{label}</Label>
  <div class="group">
    <slot></slot>
  </div>
</InspectorRow>

<style>
  .group {
    flex: 1;
    display: flex;
    gap: 5px;
  }
</style>
