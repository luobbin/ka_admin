<template>
  <job-detail :is-edit='false'></job-detail>
</template>

<script>
import JobDetail from './components/JobDetail'

export default {
  name: 'createForm',
  components: { JobDetail: JobDetail }
}
</script>

