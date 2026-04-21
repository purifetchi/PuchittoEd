<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Property from '../Property.svelte'
  import Checkbox from '../../common/Checkbox.svelte'

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
      setter(checked)
    }
  })
</script>

<Property label={name}>
  <Checkbox bind:checked />
</Property>

<style>
</style>
