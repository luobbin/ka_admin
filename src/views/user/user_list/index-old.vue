
<template>
<el-container v-loading="mingxilistLoading">
  <el-header class="tit">
    <div class="r_box">
      <ul>
        <li>
          <el-select class="item-choose" v-model="xlvalue" size="small" style="width:115px;" clearable>
            <el-option  label="明细事件" :value="xlvalue"></el-option>
          </el-select>
        </li>
        <li>
          <el-select class="item-choose" v-model="mxvalue" size="small" style="width:150px;" placeholder="全部明细" clearable>
            <el-option v-for="item in mx" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
        <li>
          会员名 :
          <el-input style="width:150px;" clearable size="small">
          </el-input>
        </li>
        <li>
          会员ID :
          <el-input style="width:150px;" clearable size="small">
          </el-input>
        </li>
        <li>
          <el-date-picker v-model="pickerdata" type="date" placeholder="选择日期" size="small">
          </el-date-picker>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchmingxi">搜索</el-button>
        </li>
      </ul>
    </div>
  </el-header>

  <el-main class="main">

    <el-table 
      border size="small" 
      :data="mingxilist"  
      tooltip-effect="dark" 
      style="width: 100%; 
      text-align:center"
      @selection-change="xuanzemx">
      <el-table-column type="selection" width="35">
      </el-table-column>
      <el-table-column prop="user.ddusername" label="会员">

      </el-table-column>
      <el-table-column prop="shijian_info.title" label="事件">

      </el-table-column>
      <el-table-column prop="source" label="说明" min-width="300">

      </el-table-column>
      <el-table-column prop="money" label="金额">

      </el-table-column>
      <el-table-column prop="jifenbao" label="集分宝">

      </el-table-column>
      <el-table-column prop="jifen" label="积分">

      </el-table-column>
      <el-table-column prop="addtime" label="时间">

      </el-table-column>
      <el-table-column prop="leave_money" label="剩余金额">

      </el-table-column>
      <el-table-column prop="leave_jifenbao" label="剩余积分宝">

      </el-table-column>

    </el-table>

  <div class="tab_foot">
    <div class="shanshu">
      <el-button 
        type="danger" 
        style="letter-spacing:2px;font-size:16px;" 
        size="small" 
        @click="delmxdata()">删除</el-button>
    </div>
    <div class="block">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="pagenumber"
        :page-size="15"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>

  </el-main>
</el-container>
</template>

<script>
import {
  fetchMingXiList,
  fetchDelmxdata
} from '@/api/mingxilist'

export default {
  name: 'mingxi_list',
  props: {

  },
  data() {
    return {
      pickerdata: '',
      mingxilist: [],
      mingxilistLoading: true,
      pagenumber: 1,
      total: 0,
      xlvalue:'',
      mx: [{
        value: 'qbmx',
        label: '全部明细'
      }, {
        value: 'zczs1',
        label: '注册赠送'
      }, {
        value: 'tbfl2',
        label: '淘宝返利'
      }, {
        value: 'scfl3',
        label: '商城返利'
      }, {
        value: 'mrqd4',
        label: '每日签到'
      }, {
        value: 'fxjl5',
        label: '分享奖励'
      }, {
        value: 'tjsd6',
        label: '推荐晒单'
      }, {
        value: 'tjsd7',
        label: '推荐晒单'
      }, {
        value: 'tbfl8',
        label: '淘宝返利'
      }, {
        value: 'txcg9',
        label: '提现成功'
      }, {
        value: 'dhcg10',
        label: '兑换成功'
      }, {
        value: 'hytx11',
        label: '好友提现'
      }, {
        value: 'scfl12',
        label: '商城返利'
      }, {
        value: 'tbtk13',
        label: '淘宝退款'
      }, {
        value: 'tbtd14',
        label: '淘宝退单'
      }, {
        value: 'qxtg15',
        label: '取消推广'
      }, {
        value: 'hxjl16',
        label: '红心奖励'
      }, {
        value: 'ppfl17',
        label: '拍拍返利'
      }, {
        value: 'ppfl18',
        label: '拍拍返利'
      }, {
        value: 'yexg19',
        label: '余额修改'
      }, {
        value: 'zzjl20',
        label: '站长奖励'
      }, {
        value: 'zzkc21',
        label: '站长扣除'
      }, {
        value: 'jezh22',
        label: '金额转换'
      }, {
        value: 'sctk23',
        label: '商城退款'
      }, {
        value: 'blyxjl24',
        label: '爆料有效奖励'
      }, {
        value: 'bltgjl24',
        label: '爆料推广奖励'
      }, {
        value: 'fxtgjl24',
        label: '分享推广奖励'
      }, {
        value: 'bltgth24',
        label: '爆料推广退回'
      }, {
        value: 'fxtgth24',
        label: '分享推广退回'
      }, {
        value: 'bdsr24',
        label: '被动收入'
      }, {
        value: 'csjz24',
        label: '慈善捐助'
      }, {
        value: 'rwjl24',
        label: '任务奖励'
      }, {
        value: 'scgwj',
        label: '首次购物奖'
      }, {
        value: 'csjzth33',
        label: '慈善捐助退回'
      }, {
        value: 'wxhyfx',
        label: '微信好友分享(微信好友分享)'
      }, {
        value: 'pyqfx',
        label: '朋友圈分享(朋友圈分享)'
      }, {
        value: 'qqkjfx',
        label: 'QQ空间分享(QQ空间分享)'
      }, {
        value: 'qqhyfx',
        label: 'QQ好友分享(QQ好友分享)'
      }, {
        value: 'bdjl',
        label: '被动收入(bdjl)'
      }, {
        value: 'bdjl_tui',
        label: '被动收入退回(bdjl_tui)'
      }, {
        value: 'task_1',
        label: '任务奖励(task_1)'
      }, {
        value: 'youjian_1',
        label: '邮件激活(youjian_1)'
      }, {
        value: 'mobile_1',
        label: '手机激活(mobile_1)'
      }, {
        value: 'qiandao_1',
        label: '连续签到(qiandao_1)'
      }, {
        value: 'tj_1',
        label: '推广奖励(tj_1)'
      }, {
        value: 'gendan_pp_tuikuan',
        label: '淘宝部分退款(gendan_pp_tuikuan)'
      }, {
        value: 'lg_tuikuan',
        label: '淘宝退款(lg_tuikuan)'
      }, {
        value: 'lg_tuikuan_parent',
        label: '被动收入退回(lg_tuikuan_parent)'
      }, {
        value: 'lg_addkf',
        label: '集分宝加分(lg_addkf)'
      }, {
        value: 'lg_addkfgl',
        label: '集分宝被动加分(lg_addkfgl)'
      }, {
        value: 'lg_subkfgl',
        label: '集分宝被动退回(lg_subkfgl)'
      }, {
        value: 'lg_1',
        label: '淘宝返利(lg_1)'
      }, {
        value: 'lg_1b',
        label: '被动收入(lg_1b)'
      }, {
        value: 'lg_2',
        label: '淘宝退款(lg_2)'
      }, {
        value: 'lg_2b',
        label: '被动收入退回(lg_2b)'
      }, {
        value: 'lg_first',
        label: '首次购物奖(lg_first)'
      }, {
        value: 'lg_k_first',
        label: '首次购物奖扣除(lg_k_first)'
      }, {
        value: 'lg_3',
        label: '订单认领加分(lg_3)'
      }, {
        value: 'lg_3b',
        label: '订单认领关联加分(lg_3b)'
      }, {
        value: 'lg_4',
        label: '订单认领扣分(lg_4)'
      }, {
        value: 'lg_4b',
        label: '订单认领关联扣分(lg_4b)'
      }, {
        value: 'lg_tx2',
        label: '提现退回(lg_tx2)'
      }, {
        value: 'ma_1',
        label: '商品分享奖励(ma_1)'
      }, {
        value: 'ma_2',
        label: '微信好友商品分享(ma_2)'
      }, {
        value: 'ma_3',
        label: 'QQ好友商品分享(ma_3)'
      }, {
        value: 'ma_4',
        label: '朋友圈商品分享(ma_4)'
      }, {
        value: 'ma_5',
        label: 'QQ空间商品分享(ma_5)'
      }, {
        value: 'xrgwjl19_1',
        label: '新人购物奖励(xrgwjl19_1)'
      }, {
        value: 'xrgwjl9_1',
        label: '新人购物奖励(xrgwjl9_1)'
      }, {
        value: 'xrbdjl19_1',
        label: '新人购物奖励(被动收入)(xrbdjl19_1)'
      }, {
        value: 'xrbdjl9_1',
        label: '新人购物奖励(被动收入)(xrbdjl9_1)'
      }, {
        value: 'xrgwjl19_2',
        label: '新人购物奖励(退回)(xrgwjl19_2)'
      }, {
        value: 'xrbdjl19_2',
        label: '新人购物奖励(被动收入退回)(xrbdjl19_2)'
      }, {
        value: 'xrbdjl9_2',
        label: '新人购物奖励(被动收入退回)(xrbdjl9_2)'
      }, {
        value: 'lg_5',
        label: '商城返利(lg_5)'
      }, {
        value: 'lg_5b',
        label: '商城被动收入(lg_5b)'
      }, {
        value: 'lg_6',
        label: '商城退款(lg_6)'
      }, {
        value: 'lg_6b',
        label: '商城被动收入退回(lg_6b)'
      }, {
        value: 'lg_a',
        label: '重复奖励退回(lg_a)'
      }, {
        value: 'lg_ab',
        label: '重复奖励关联退回(lg_ab)'
      }, {
        value: 'jd416md',
        label: '京东416奖励(jd416md)'
      }, {
        value: 'jd418md',
        label: '京东418免单奖励(jd418md)'
      }, {
        value: 'jd516',
        label: '京东516购物奖励(jd516)'
      }, {
        value: 'jd626pq',
        label: '京东626拼券奖励(jd626pq)'
      }, {
        value: 'pdd618',
        label: '拼多多618购物奖励(pdd618)'
      }, {
        value: 'pddlx',
        label: '拼多多拉新奖励(pddlx)'
      }, {
        value: 'pddlxbd',
        label: '拼多多拉新被动奖励(pddlxbd)'
      }, {
        value: 'sctx',
        label: '商城提现中(sctx)'
      }, {
        value: 'lg_7',
        label: '淘宝提现申请(lg_7)'
      }, {
        value: 'phone_app_share',
        label: 'APP分享(phone_app_share)'
      }, {
        value: 'plugin_qq_qzone',
        label: 'QQ返利机器人(plugin_qq_qzone)'
      }],
      mxvalue: ''
    }

  },
  created() {
    this.getMingXiList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getMingXiList() {
      //请求明细数据
      this.mingxilistLoading = true
      fetchMingXiList(this.pagenumber).then(res => {
        console.log(res.data);
        this.mingxilist = res.data.data
        this.total = res.data.total
        this.mingxilistLoading = false
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenumber = ` ${val}`
      this.getMingXiList()
    },
    xuanzemx(val){
      //选择明细数据
      this.newdelmxdata = val;
      console.log(this.newdelmxdata);
    },
    delmxdata(){
      //删除数据
      this.$confirm('确认是要删除选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.newdelmxdata.map((item,index) => {
          console.log(item);
          var mxid = item.uid;
          fetchDelmxdata(mxid).then(res => {
            console.log(res.data)
          })
        })
        this.getMingXiList();//删除成功时重新刷新当前列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    searchmingxi(){
      
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
input {
  padding: 0 10px;
}
.tit {
  position: relative;
  top: 20px;
  padding: 0 0 0 15px;
  .l_box {
    min-width: 300px;
    li {
      // height: 10px;
      float: left;
      letter-spacing: 1.5px;
      line-height: 26px;
    }
  }
  .r_box {
    min-width: 900px;
    float: right;
    margin-right: 2%;
    li {
      float: left;
      margin-right: 10px;
    }
  }
}
.main {
  padding: 15px 25px 25px 15px !important;
  .tab_foot {
    width: 100%;
    height: 60px;
    line-height: 60px;
    border: 1px solid #f5f5f5;
    border-top: 0;
    .shanshu {
      display: inline-block;
      margin-left: 10px; // border-left:1px solid #f5f5f5;  
    }
    .block {
      transform: translate(0, 20%);
      margin-left: 20%;
      display: inline-block;
    }
  }
}
@media screen and (max-width:1640px){
  .main{
    padding-top: 44px !important;
  }
}
@media screen and (max-width:1304px){
  .main{
    padding-top: 64px !important;
  }
}
</style>
