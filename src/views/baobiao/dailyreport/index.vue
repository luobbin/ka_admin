<template>
  <div class="tab-container">
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <list v-if='activeName==item.key' :type='item.key' @create='showCreatedTimes'></list>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import list from './list'

export default {
  name: 'tab',
  components: { list },
  data() {
    return {
      tabMapOptions: [
        { label: '总数据', key: 'zong' },
        { label: '淘宝数据', key: 'tao' },
        { label: '商城数据', key: 'mall' },
        { label: '拼多多数据', key: 'pdd' }
      ],
      activeName: 'zong',
      createdTimes: 0
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
