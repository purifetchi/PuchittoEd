<script lang="ts">
  import type { GameObject } from 'puchitto/objects'
  import Box from '@lucide/svelte/icons/box'
  import InspectorPart from './InspectorPart.svelte'
  import InspectorRow from './InspectorRow.svelte'
  import Checkbox from '../common/Checkbox.svelte'
  import Input from '../common/Input.svelte'

  let { obj }: { obj: GameObject } = $props()

  let name = $state('')
  let visible = $state(true)

  $effect(() => {
    name = obj.name
    visible = obj.visible
  })

  $effect(() => {
    if (name !== obj.name) {
      obj.name = name
    }
  })

  $effect(() => {
    if (visible !== obj.visible) {
      obj.setVisible(visible)
    }
  })
</script>

<InspectorPart>
  <InspectorRow>
    <Checkbox bind:checked={visible} />
    <Box />
    <Input bind:value={name} />
  </InspectorRow>
</InspectorPart>

<style>
</style>
