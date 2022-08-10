<template>
  <job-detail :is-edit='true'></job-detail>
</template>

<script>
import JobDetail from './components/JobDetail'

export default {
  name: 'editForm',
  components: { JobDetail: JobDetail }
}
</script>

