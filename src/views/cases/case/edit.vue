<template>
  <item-detail :is-edit='true'></item-detail>
</template>

<script>
import ItemDetail from './components/ItemDetail'

export default {
  name: 'editForm',
  components: { ItemDetail }
}
</script>

