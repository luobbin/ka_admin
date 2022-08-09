<template>
  <div class="app-container">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="80">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column  label="日期"  width="120">
        <template slot-scope="scope">
          <span>{{scope.row.do_day}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="type == 'zong'" label="总交易额（元）" align="center">
        <template slot-scope="scope">
          <span>{{(scope.row.tao_goods_sum+scope.row.mall_goods_sum+scope.row.pdd_goods_sum/100)|numFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'zong'" label="总收益（元）" align="center">
        <template slot-scope="scope">
          <span>{{(scope.row.tao_zsy+scope.row.mall_zsy+scope.row.pdd_zsy/100)|numFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'zong'" label="总支出(元)" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tixian_sum}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'zong'" label="总交易量（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tao_tradenum+scope.row.mall_tradenum+scope.row.pdd_tradenum}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'zong'" label="总有效订单" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tao_tradenum_ok+scope.row.mall_order_ok+scope.row.pdd_order_ok}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'zong'" label="会员数（个）" align="center">
        <template slot-scope="scope">
          {{scope.row.user_sum}}
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'zong'" label="有效会员（个）" align="center">
        <template slot-scope="scope">
          {{scope.row.user_youixao_sum}}
        </template>
      </el-table-column>

      <el-table-column v-if="type == 'tao'" label="总交易额（元）" align="center">
        <template slot-scope="scope">
          {{scope.row.tao_goods_sum}}
        </template>
      </el-table-column>
      <el-table-column  v-if="type == 'tao'" label="总收益（元）" align="center">
        <template slot-scope="scope">
          {{scope.row.tao_zsy}}
        </template>
      </el-table-column>
      <el-table-column  v-if="type == 'tao'" label="总交易量" align="center">
        <template slot-scope="scope">
          {{scope.row.tao_tradenum}}
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'tao'" label="已确认订单数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tao_tradenum_ok}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'tao'" label="未认领订单数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tao_tradenum_unclaim}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'tao'" label="被动收入（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tao_bd_jifenbao/100|numFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'tao'" label="分享奖金（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.tao_fx_jifenbao/100|numFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="type == 'mall'" label="总交易额（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_goods_sum}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'mall'" label="总收益（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_zsy}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'mall'" label="总交易量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_tradenum}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'mall'" label="有效订单数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_order_ok}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'mall'" label="未核对订单数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_order_no}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'mall'" label="失效订单数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_order_faild}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'mall'" label="未认领订单数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_no_user}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'mall'" label="分享奖金（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_fx_jifenbao/100|numFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'mall'" label="被动收入（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.mall_bd_jifenbao/100|numFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="type == 'pdd'" label="总交易额（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pdd_goods_sum/100|numFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'pdd'" label="总收益（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pdd_zsy/100|numFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'pdd'" label="总交易量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pdd_tradenum}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'pdd'" label="有效订单数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pdd_order_ok}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'pdd'" label="失效订单数" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pdd_order_no}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'pdd'" label="分享奖金（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pdd_fx_jifenbao/100|numFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="type == 'pdd'" label="被动收入（元）" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pdd_bd_jifenbao/100|numFilter}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.upstatus!='0'" size="mini" type="success" @click="handleModifyStatus(scope.row,'0')">更新
          </el-button>
          <span v-if="scope.row.upstatus!='1'" size="mini">更新中
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
import { getList,updateData } from '@/api/dailyreport'

export default {
  props: {
    type: {
      type: String,
      default: 'zong'
    }
  },
  data() {
    //初始化默认值
    return {
      tableKey: 0,
      list: null,
      total: 310,
      listLoading: true,
      //type: this.type,
      listQuery: {
        page: 1,
        limit: 31,
        filter: ''
      }
    }
  },
  filters: {
    numFilter(value) {
      //截取当前数据到小数点后两位
      let realVal = Number(value).toFixed(2)
      // num.toFixed(2)获取的是字符串
      return Number(realVal)
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
      if (this.type=='tao') {
        this.listQuery.filter = 'id;do_day;tao_goods_sum;tao_zsy;tao_tradenum;tao_tradenum_ok;tao_bd_jifenbao;tao_fx_jifenbao'
      } else if(this.type=='mall') {
        this.listQuery.filter = 'id;do_day;mall_goods_sum;mall_zsy;mall_tradenum;mall_order_ok;mall_order_no;mall_order_faild;mall_no_user;mall_fx_jifenbao;mall_bd_jifenbao'
      } else if(this.type=='pdd') {
        this.listQuery.filter = 'id;do_day;pdd_goods_sum;pdd_zsy;pdd_tradenum;pdd_order_ok;pdd_order_no;pdd_fx_jifenbao;pdd_bd_jifenbao'
      }
      getList(this.listQuery,this.type).then(response => {
        for (var i = response.data.length - 1; i >= 0; i--) {
          response.data[i].upstatus = 1
        }
        this.list = response.data
        //this.total = response.data.total
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
      updateData(row).then(response => {
        this.$message({
          message: response.data.message,
          type: 'success'
        })
        row.upstatus = status
      })
      
    },
  }
}
</script>
