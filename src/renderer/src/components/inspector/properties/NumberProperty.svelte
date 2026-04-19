<script lang="ts">
  import { GameObject } from 'puchitto/objects'
  import Input from '../../common/Input.svelte'
  import Property from '../Property.svelte'

  let { name, obj, path }: { name: string; obj: GameObject; path: string } = $props()

  let value = $state(0)
  let accessor: () => number
  let setter: (value: number) => void

  $effect(() => {
    accessor = () => obj[path]
    setter = (value: number) => (obj[path] = value)

    value = accessor()
  })

  $effect(() => {
    const previous = accessor()

    if (previous !== value) {
      setter(value)
    }
  })
</script>

<Property label={name}>
  <Input bind:value />
</Property>

<style>
</style>
