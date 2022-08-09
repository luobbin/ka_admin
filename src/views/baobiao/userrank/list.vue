<template>
  <div class="app-container">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='排名' width="80">
        <template slot-scope="scope">
          {{(scope.$index+1)+listQuery.limit*(listQuery.page-1)}}
        </template>
      </el-table-column>
      <el-table-column  label="会员名">
        <template slot-scope="scope">
          <span>{{scope.row.ddusername}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="type == 'jifenbao'" label="总获得集分宝（个）" align="center" width="210">
        <template slot-scope="scope">
          <span>{{scope.row.total}}</span>
        </template>
      </el-table-column>
      <el-table-column v-else-if="type == 'money'" label="总获得金额(元)" align="center" width="210">
        <template slot-scope="scope">
          <span>{{scope.row.total}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="type == 'jifenbao'" label="现有集分宝（个）" align="center" width="210">
        <template slot-scope="scope">
          {{scope.row.jifenbao}}
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'jifenbao'" label="已提现集分宝（个）" align="center" width="210">
        <template slot-scope="scope">
          {{scope.row.tbyitixian}}
        </template>
      </el-table-column>

      <el-table-column v-if="type == 'money'" label="现有金额(元)" align="center" width="210">
        <template slot-scope="scope">
          {{scope.row.money}}
        </template>
      </el-table-column>
      <el-table-column  v-if="type == 'money'" label="已提现金额(元)" align="center" width="210">
        <template slot-scope="scope">
          {{scope.row.yitixian}}
        </template>
      </el-table-column>

      <el-table-column  v-if="type == 'money'||type == 'jifenbao'" label="注册时间" align="center" width="200">
        <template slot-scope="scope">
          {{scope.row.regtime}}
        </template>
      </el-table-column>

      <el-table-column v-else-if="type == 'tuiguang'" label="总推广佣金（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sum}}</span>
        </template>
      </el-table-column>
      <el-table-column v-else-if="type == 'tuiguang'" label="总推广会员数（位）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.user_num}}</span>
        </template>
      </el-table-column>

      <el-table-column v-else-if="type == 'share_jifenbao'" label="总分享奖励（集分宝）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sum}}</span>
        </template>
      </el-table-column>

      <el-table-column v-else-if="type == 'share_jifen'" label="总分享奖励（积分）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sum}}</span>
        </template>
      </el-table-column>

      <el-table-column v-else></el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/userrank'

export default {
  props: {
    type: {
      type: String,
      default: 'jifenbao'
    }
  },
  data() {
    //初始化默认值
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      //type: this.type,
      listQuery: {
        page: 1,
        limit: 15,
        filter: ''
      }
    }
  },
  //添加后重载列表
  created() {
    this.getList()
  },
  methods: {
    //获取列表
    getList() {
      this.listLoading = true
      if (this.type=='jifenbao') {
        this.listQuery.filter = 'id;ddusername;jifenbao;tbyitixian;regtime'
      } else if(this.type=='money') {
        this.listQuery.filter = 'id;ddusername;money;yitixian;regtime'
      }
      getList(this.listQuery,this.type).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    //更换页面
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    //显示成功状态
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.gamelr = status
    },
  }
}
</script>
