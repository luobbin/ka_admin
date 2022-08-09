<template>
  <detail :is-edit='true'></detail>
</template>

<script>
import Detail from './components/Detail'

export default {
  name: 'editForm',
  components: { Detail }
}

</script>
