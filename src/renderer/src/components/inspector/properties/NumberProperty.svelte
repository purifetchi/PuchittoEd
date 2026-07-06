<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Input from '../../common/Input.svelte'
  import Property from '../Property.svelte'
  import { recordCommand } from '../../../editor/systems/history/editorHistory'
  import { EntityPropertyChangedCommand } from '../../../editor/systems/history/commands/entityPropertyChangedCommand'

  let { name, obj, path }: { name: string; obj: GameObject; path: string } = $props()

  let value = $state(0)
  let accessor: () => number
  let setter: (value: number) => void

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: number) => (obj[path] = Number(value))

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
