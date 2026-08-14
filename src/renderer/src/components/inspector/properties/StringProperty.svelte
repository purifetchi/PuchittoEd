<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Input from '../../common/Input.svelte'
  import Property from '../Property.svelte'
  import { recordCommand } from '../../../editor/systems/history/editorHistory'
  import { EntityPropertyChangedCommand } from '../../../editor/systems/history/commands/entityPropertyChangedCommand'

  let {
    name,
    obj,
    path,
    hints
  }: { name: string; obj: GameObject; path: string; hints?: Record<string, unknown> } = $props()

  let value = $state('')
  let accessor: () => string
  let setter: (value: string) => void

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: string) => (obj[path] = value)

    value = accessor()
  })

  $effect(() => {
    const previous = accessor()

    if (previous !== value) {
      recordCommand(new EntityPropertyChangedCommand(obj, path, previous, value))
      setter(value)
    }
  })
</script>

<Property label={name}>
  <Input bind:value />
</Property>

<style>
</style>
