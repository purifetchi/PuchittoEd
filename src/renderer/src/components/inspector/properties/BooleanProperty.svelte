<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import Checkbox from '../../common/Checkbox.svelte'
  import { recordCommand } from '../../../editor/systems/history/editorHistory'
  import { EntityPropertyChangedCommand } from '../../../editor/systems/history/commands/entityPropertyChangedCommand'

  let { name, obj, path }: { name: string; obj: GameObject; path: string } = $props()

  let checked = $state(true)
  let accessor: () => boolean
  let setter: (value: boolean) => void

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: boolean) => (obj[path] = value)

    checked = accessor()
  })

  $effect(() => {
    const previous = accessor()

    if (previous !== checked) {
      recordCommand(new EntityPropertyChangedCommand(obj, path, previous, checked))
      setter(checked)
    }
  })
</script>

<Property label={name}>
  <Checkbox bind:checked />
</Property>

<style>
</style>
