<script lang="ts">
  import type { Snippet } from 'svelte'
  import Label from '../common/Label.svelte'
  import InspectorRow from './InspectorRow.svelte'

  let { label, children }: { label: string; children: Snippet } = $props()
</script>

<InspectorRow>
  <Label>{label}</Label>
  <div class="group">
    {@render children()}
  </div>
</InspectorRow>

<style>
  .group {
    flex: 1;
    display: flex;
    gap: 5px;
    align-items: center;
  }
</style>
