<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-row :data="analyse" v-loading="loading" element-loading-text="Loading" class="panel-group" :gutter="40">      
        <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">淘宝总佣金(元)</div>
              <b class="card-panel-num">{{analyse.taoyj}}</b>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">淘宝总利润(元)</div>
              <b class="card-panel-num">{{analyse.taolr|xiaoshuFilter}}</b>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">商城总佣金(元)</div>
              <b class="card-panel-num">{{analyse.paiyj|xiaoshuFilter}}</b>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">商城总利润(元)</div>
              <b class="card-panel-num">{{analyse.pailr|xiaoshuFilter}}</b>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">拼多多总佣金(元)</div>
              <b class="card-panel-num">{{analyse.mallyj|xiaoshuFilter}}</b>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="4" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">拼多多总利润(元)</div>
              <b class="card-panel-num">{{analyse.malllr|xiaoshuFilter}}</b>
            </div>
          </div>
        </el-col>
      </el-row>
      
    </div>
    
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="80">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column  label="月份" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column label="淘宝佣金(元)" align="center" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.taoyj}}</span>
        </template>
      </el-table-column>
      <el-table-column label="淘宝利润(元)" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.taolr}}
        </template>
      </el-table-column>
      <el-table-column label="商城佣金(元)" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.mallyj}}
        </template>
      </el-table-column>
      <el-table-column label="商城利润(元)" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.malllr}}
        </template>
      </el-table-column>
      <el-table-column label="拼多多佣金(元)" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.paiyj}}
        </template>
      </el-table-column>
      <el-table-column label="拼多多利润(元)" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.pailr}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="stime" label="开始时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.stime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="dtime" label="结束时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.dtime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.gamelr=='0'" size="mini" type="success" @click="handleModifyStatus(scope.row,'1')">更新
          </el-button>
          <span v-if="scope.row.gamelr!='0'" size="mini">更新中
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList, updateData, getDetail } from '@/api/statement'

export default {
  data() {
    //初始化默认值
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        searchJoin: 'and',
        search: '',
        searchFields: '',
        orderBy: 'id',
        sortedBy: 'desc'
      },
      searchQuery: {
        field: '',
        keyword: '',
        stime: '',
        etime: '',
        search: '',
        searchFields: ''
      },
      analyse: {
        taoyj: 0,
        taolr: 0,
        paiyj: 0,
        pailr: 0,
        mallyj: 0,
        malllr: 0,
      }
    }
  },
  //状态更改后的结果
  filters: {
    xiaoshuFilter(num) {
      return num.toFixed(2)
    }
  },
  //添加后重载列表
  created() {
    this.getDetail()
    this.getList()
  },
  methods: {
    //获取列表
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //获取总数据
    getDetail() {
      this.loading = true
      getDetail().then(response => {
        this.analyse = response.data
        this.loading = false
      })
    },
    //更换页面
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    //显示成功状态
    handleModifyStatus(row, status) {
      updateData(row).then(response => {
        this.$message({
          message: response.data.message,
          type: 'success'
        })
        row.gamelr = status

      })
      
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 3px;
  .card-panel-col{
    margin-bottom: 5px;
  }
  .card-panel {
    // cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-col {
        background: #C1C1C1;
      }
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 6px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 8px;
        text-align: center;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>