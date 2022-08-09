<template>
  <banner-detail :is-edit='false'></banner-detail>
</template>

<script>
import BannerDetail from './components/BannerDetail'

export default {
  name: 'createForm',
  components: { BannerDetail }
}
</script>

