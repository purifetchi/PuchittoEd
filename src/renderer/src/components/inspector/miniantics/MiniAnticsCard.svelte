<script lang="ts">
  import type { ObjectAntics } from 'puchitto/objects'
  import Input from '../../common/Input.svelte'
  import Label from '../../common/Label.svelte'
  import Select from '../../common/Select.svelte'
  import IconButton from '../../common/IconButton.svelte'
  import Edit from '@lucide/svelte/icons/file-pen-line'
  import Trash from '@lucide/svelte/icons/trash-2'

  let { antic }: { antic: ObjectAntics } = $props()

  let values = ['click', 'rpc', 'attach']

  let name = $state('')
  let on = $state('')
  let showcase = $state('')

  $effect(() => {
    on = antic.on
    name = antic.name
    showcase = antic.script.source
  })
</script>

<div class="antic-card">
  <div class="antic-row">
    <Label width={30}>On</Label>
    <Select bind:value={on} bind:values style="flex: 0.8" />
    <Label style="width: 35px; margin-left: 10px; text-align: right; margin-right: 5px;">Name</Label>
    <Input bind:value={name} placeholder="(none)" />
  </div>
  <div class="antic-row">
    <Input bind:value={showcase} class="code-preview" readonly />
    <IconButton onclick={() => {}}>
      <Edit />
    </IconButton>
    <IconButton onclick={() => {}}>
      <Trash />
    </IconButton>
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

  :global(.code-preview) {
    color: #ce9178 !important;
    font-family: var(--font-mono);
    text-overflow: ellipsis;
    pointer-events: none;
  }
</style>
