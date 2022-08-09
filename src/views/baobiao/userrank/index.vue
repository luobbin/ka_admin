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
        { label: '集分宝返利排行', key: 'jifenbao' },
        { label: '金额返利排行', key: 'money' },
        { label: '推广排名', key: 'tuiguang' },
        { label: '集分宝分享排名', key: 'share_jifenbao' },
        { label: '集分分享排名', key: 'share_jifen' }
      ],
      activeName: 'jifenbao',
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
