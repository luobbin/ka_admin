<template>
  <item-detail :is-edit='false'></item-detail>
</template>

<script>
import ItemDetail from './components/ItemDetail'
export default {
  name: 'createForm',
  components: { ItemDetail }
}
</script>

