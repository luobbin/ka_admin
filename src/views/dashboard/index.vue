<template>
  <div class="dashboard-container">
    <div class="dashboard-text" style="text-align: center; margin-top: 10rem">{{name}},欢迎您登录后台</div>
    <div class="dashboard-text" style="text-align: center;">上次登录时间：{{avatar}}</div>
    <!-- <div class="dashboard-text">roles:<span v-for='role in roles'  >{{role}}</span></div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAvatar } from '@/utils/auth'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {
      avatar:getAvatar()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
