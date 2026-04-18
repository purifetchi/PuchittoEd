<script lang="ts">
  import type { ObjectAntics } from 'puchitto/objects'
  import Input from '../../common/Input.svelte'
  import Label from '../../common/Label.svelte'

  let { antic }: { antic: ObjectAntics } = $props()

  let name = $state(antic.name)
  let showcase = $derived(antic.script.toString())
</script>

<div class="antic-card">
  <div class="antic-row">
    <Label>On</Label>
    <Label>Name</Label>
    <Input bind:value={name} placeholder="(none)" />
  </div>
  <div class="antic-row">
    <Input bind:value={showcase} />
  </div>
</div>

<style>
  .antic-card {
    background: var(--bg-deep);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .antic-row {
    display: flex;
    align-items: center;
    gap: 5px;
  }
</style>
