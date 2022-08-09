<template>
<el-container>
  <el-header class="tit">
    <div class="r_box">
      <ul>
        <li>
          <div class="block">
            <span class="demonstration">月结日期：</span>
            <el-date-picker
              style="width:150px;"
              v-model="searchuserQuery.dataval"
              type="month"
              placeholder="选择日期时间"
              size="small"
              value-format="yyyy-MM">
            </el-date-picker>
          </div>
        </li>
        <li>
          <el-select class="item-choose" v-model="searchuserQuery.jnvalue" size="small" style="width:125px;" clearable placeholder="缴纳状态">
            <el-option v-for="item in jnOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
        <li>
          <el-select class="item-choose" v-model="searchuserQuery.shvalue" size="small" style="width:105px;" clearable placeholder="审核状态">
            <el-option v-for="item in shOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
        <li>
          <el-input style="width:150px;" clearable size="small" placeholder="请输入会员名" v-model="searchuserQuery.usernameval"></el-input>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchuser">查询</el-button>
        </li>
        <li>
          <el-button type="danger" size="small" @click="batchClear(1)" 
            v-text="flag1? '批量清除逾期':'< 退出批量清除逾期'"
            :disabled='disabled1' >
          </el-button>
        </li>
        <li>
          <el-button type="danger" size="small" @click="batchClear(2)" 
            v-text="flag2? '批量通过审核':'< 退出批量通过审核'"
            :disabled='disabled2' >
          </el-button>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-download" size="small" @click="downloadXls" :loading="downloadLoading" :disabled='!flag1||!flag2'>导出报表</el-button>
        </li>
      </ul>
    </div>
  </el-header>

  <el-main class="main">

    <el-table 
      border
      ref="tableList"
      size="small" 
      :data="userlist"
      v-loading="userlistLoading"
      highlight-current-row 
      tooltip-effect="dark" 
      style="width:100%;text-align:center" 
      @selection-change="xuanzeshuju">
      <el-table-column type="selection" width="35" v-if="checkBox">
      </el-table-column >
      <el-table-column  label="序号" min-width="60" prop="index">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="time"
        label="月结日期"
        min-width="85">
      </el-table-column>
      <el-table-column
        prop="user.ddusername"
        label="会员名"
        min-width="90">
      </el-table-column>
      <el-table-column
        prop="ali_income"
        label="月结发钱">
      </el-table-column>
      <el-table-column
        prop="ali_tax"
        label="预代扣税">
      </el-table-column>
      <el-table-column
        prop="ali_technical"
        label="技术服务费"
        min-width='82'>
      </el-table-column>
      <el-table-column
        prop="salary"
        label="会员上月应提现金额"
        min-width='85'>
      </el-table-column>
      <el-table-column  prop='reward'  :render-header="renderHeader" min-width='105'></el-table-column>
      <el-table-column  prop='penalty'  :render-header="defaultMoney" min-width='85'></el-table-column>
      <el-table-column  prop='receivable'  :render-header="shouldPayMoney" min-width='85'></el-table-column>
      <el-table-column
        prop="already_money"
        label="已收金额">
      </el-table-column>
      <el-table-column
        prop="re_money"
        label="未收金额"
        >
      </el-table-column>
      <el-table-column
        prop="ali_frozen"
        label="冻结金额"
        >
      </el-table-column>
      <el-table-column
        prop="Jn_status"
        label="缴纳状态"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="审核状态"
        >
      </el-table-column>
      <el-table-column
        prop="admin"
        label="操作人"
        >
      </el-table-column>
      <el-table-column
        prop="dotime"
        label="操作时间"
        min-width='85'>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="140">
          <div slot-scope="scope">
            <el-button type="text" size="small" @click="tongguo(scope.$index,scope.row)" :disabled='!flag1||!flag2' v-if="scope.row.status !=='通过审核'">通过</el-button>
            <el-button type="text" size="small" @click="chakanmx(scope.$index,scope.row)" :disabled='!flag1||!flag2' >查看缴款明细</el-button>
          </div>
      </el-table-column>
    
    </el-table >
      <!-- 查看缴款明细弹窗 -->
      <el-dialog title="缴款明细" :visible.sync="lookmingxi" :before-close="handleClose" style="padding:0 0 20px 0">
        <ul style="margin:-20px 0 10px 15px;">
          <li style="margin-left:-10px;font-weight:600;color:grey;"><span v-text="times"></span></li>
          <li>应收金额：<span v-text="yings"></span></li>
          <li>已收金额：<span v-text="yis"></span></li>
          <li>未收金额：<span v-text="weis"></span></li>
        </ul>
        <el-table :data="JkmxData" style="text-align:center;" border>
          <el-table-column property="id" label="ID" width="60"></el-table-column>
          <el-table-column property="ddusername" label="会员名" width="110"></el-table-column>
          <el-table-column property="time" label="月结日期" width="110"></el-table-column>
          <el-table-column property="bill_num" label="支付宝订单号" width="130"></el-table-column>
          <el-table-column property="comment" label="支付宝备注"></el-table-column>
          <el-table-column property="amount" label="支付宝转账金额" width="130"></el-table-column>
          <el-table-column property="realname" label="支付宝姓名"></el-table-column>
          <el-table-column label="操作" width="50">
              <div slot-scope="scope">
                <el-button type="text" size="small" @click="JkmxTongguo(scope.$index,scope.row)" v-if="scope.row.status !== 1">通过</el-button>
              </div>
          </el-table-column>
        </el-table>
        <div class="block" style="float: right;margin:10px -4px 0 0;">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-size="listQuery.limit"
            layout="total,prev, pager, next, jumper "
            :total="this.JkmxData.length">
          </el-pagination>
        </div>
      </el-dialog>

      <div class="tab_foot">
        <div class="shanshu" v-if="checkBox">
          <el-button type="danger" style="letter-spacing:2px;font-size:16px;" size="small" @click="sureBtn()">确认</el-button>
          <el-button type="primary" style="letter-spacing:2px;font-size:16px;" size="small"  @click="cancelBtn()">取消</el-button>
        </div>
        <div class="block">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-size="listQuery.limit"
            layout="total,prev, pager, next, jumper "
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-main>

</el-container>
</template>

<script>
// excel 插件
import Blob from './../../../vendor/Blob.js'
import Export2Excel from './../../../vendor/Export2Excel.js'

import { parseTime, parseDate } from '@/utils'
import { getUserAccountList,getUpdateList,getdownload,getShTransferList } from '@/api/xiaosun'

const jnOptions = [
  { value: '', label: '全部' },
  { value: '0', label: '未缴纳' }, 
  { value: '1', label: '已缴纳' }, 
  { value: '2', label: '已逾期'},
]

const shOptions = [
  { value: '', label: '全部' },
  { value: 'status:1', label: '已审核' }, 
  { value: 'status:0', label: '待审核' }, 
]

export default {
  name: 'UserPayMoney',
  data() {
    return {
      typeval:'',//1清理逾期 2审核
      yings:'',//应收金额
      yis:'',//已收金额
      weis:'',//未收金额
      times:'',//时间
      downloadLoading: false,
      lookmingxi:false,
      flag1:true,
      flag2:true,
      disabled1:false,
      disabled2:false,
      dataBackup:[],
      checkBox:false,//复选框
      JkmxData:[],
      userlist: [], 
      userlistLoading: false,
      total: null,
      jnOptions,
      shOptions,
      listQuery:{
        page:1,
        limit: 10,
        orderBy: 'id',
        sortedBy: 'asc',//asc 正序  desc 倒序
        search: '',
        searchJoin:'and',
        searchFields:'', //加入字段,快速列表
      },
      searchuserQuery:{
        dataval:'',//选择的时间值
        jnvalue:'',//选择的缴纳值
        shvalue:'',//选择的审核值
        usernameval:'',//会员名
        search: '',
        searchFields: '',
      },
    }
  },
  computed:{
    
  },
  created(){
    this.getUserList();
  },
  methods: {
    //?图标的hover事件
    renderHeader(h, { column, $index },index){
       return h('span', {}, [
        h('span', {}, '会员额外奖励'),
        h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '指上个月会员的（月结发钱-月代扣税-技术服务费）*3%=会员额外奖励' }}, [
           h('i', { slot: 'reference', class:'el-icon-question'}, '')
          ])
       ])
    },
    defaultMoney(h, { column, $index },index){
       return h('span', {}, [
        h('span', {}, '违约金额'),
        h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '以账单生成的5个自然日后计算违约金=应收金额*5%，若继续超过该账单的10个自然日后计算超期金额=应收金额10%' }}, [
           h('i', { slot: 'reference', class:'el-icon-question'}, '')
          ])
       ])
    },
    shouldPayMoney(h, { column, $index },index){
       return h('span', {}, [
        h('span', {}, '应收金额'),
        h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '指上个月应收金额=（月结发钱-月代扣税-技术服务费）-会员上月应提现金额-会员额外金额+违约金' }}, [
           h('i', { slot: 'reference', class:'el-icon-question'}, '')
          ])
       ])
    },
    getUserList() {
      //列表信息
      this.userlistLoading = true
        // console.log(parseDate('2019-01-15 15:30:18'));
        // console.log(parseDate('2019-01-20 15:30:18'));
      getUserAccountList(this.listQuery).then(res => {
        // console.log(res);
        if(res.data.code == 200){
          this.userlist = res.data.data.data
          for(let i = 0; i< this.userlist.length ;i++){

            //序号
            this.userlist[i].index = (res.data.data.current_page != 1 ? res.data.data.current_page * 10-9:1 ) + i;
            //时间转换
            if(this.userlist[i].dotime !== null){
              this.userlist[i].dotime = parseTime(this.userlist[i].dotime);
            }

            //status 审核状态
            if(this.userlist[i].status == 0){
              this.userlist[i].status = '未通过'
            }else if(this.userlist[i].status == 1){
              this.userlist[i].status = '通过审核'
              this.userlist[i].Jn_status = '已缴纳'
            }
                  
            //缴纳状态Jn_status
            if(this.userlist[i].penalty > 0){
              this.userlist[i].Jn_status = '已逾期'
            }
            if(this.userlist[i].penalty == 0 && this.userlist[i].re_money > 0){
              this.userlist[i].Jn_status = '未缴纳'
            }
            if(this.userlist[i].status == 1){
              this.userlist[i].Jn_status = '已缴纳'
            }

          }
          // console.log(res.data.data.data)
          this.total = res.data.data.total
        }
        this.userlistLoading = false
      })

    },
    handleCurrentChange(val) {
      //刷新分页信息
      // console.log(`当前页: ${val}`)
      this.listQuery.page = val;
      this.getUserList();
    },
    //操作 通过
    tongguo(index, row) {
      // console.log(index,row);
      this.$confirm('该会员是否缴纳完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params={ type:2 }
        getUpdateList( row.id,params ).then(res => {
            // console.log(res);
            if(res.data.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.getUserList();
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消!'
        });
      });
    },
    chakanmx(index, row){
    //操作 查看明细
      this.JkmxData='';
      if(row.bill!=''){
        this.lookmingxi = true;
        this.yings=row.receivable;
        this.yis=row.already_money;
        this.times=row.time;
        this.JkmxData = row.bill;
        for(let i = 0; i< this.JkmxData.length ;i++){
          this.JkmxData[i].ddusername = row.user.ddusername
          this.JkmxData[i].time = row.time
        }
      // console.log(this.JkmxData);
      }else{
        this.$message({
          type: 'info',
          message: '暂无缴款明细'
        });
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭查看缴款明细弹窗？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    searchuser(){
      //查询
      //每次搜索之前先清空上次searchFields的字段
      this.listQuery.searchFields = '';
      // object格式化
      const tempData = Object.assign({}, this.searchuserQuery)
      let search = tempData.search
      let searchFields = tempData.searchFields

      if (tempData.dataval) {
        search += 'time:' + tempData.dataval + '-20;';
        tempData.searchFields += 'time:=;';
      }

      if (tempData.jnvalue !=='') {
        if(tempData.jnvalue == 0){
          search +=  'penalty:0;re_money:0;';
          tempData.searchFields += 'penalty:=;re_money:>;';
        }else if(tempData.jnvalue == 1){
          search += 'status:1;';
          tempData.searchFields += 'status:=;';
        }else if(tempData.jnvalue == 2){
          search += 'penalty:0;';
          tempData.searchFields += 'penalty:>;';
        }   
      }
      
      if (tempData.shvalue !=='') {
        search += tempData.shvalue + ';';
        tempData.searchFields += 'status:=;';
      }

      if (tempData.usernameval !=='') {
        search +='user.ddusername'+':'+ tempData.usernameval + ';';
        tempData.searchFields += 'user.ddusername:=;';
      }
      this.listQuery.search = search
      this.listQuery.searchFields = tempData.searchFields


      this.listQuery.page = 1
      this.getUserList()
    },
    batchClear(val){
      //批量 1清除逾期按钮/2批量通过审核
      if(val == 1){
        this.typeval =1;
        this.flag1 = !this.flag1;
        this.disabled2=!this.disabled2;
      }
      if(val == 2){
        this.typeval =2;
        this.flag2 = !this.flag2;
        this.disabled1=!this.disabled1;
      }
      this.checkBox =!this.checkBox; //出现复选框
      this.dataBackup = [];//列表选择数据清空
      this.$refs.tableList.clearSelection();//列表样式清空 
    },
    xuanzeshuju(val) {
      //选择数据（点击拿到现有的数据） 复选框事件
      // console.log(val);
      this.dataBackup = val;
    },
    sureBtn(){
      //复选框 确定按钮
      if(this.dataBackup != ''){
        if(this.flag1 == false){
          this.$confirm('请确认是否要清除'+ this.dataBackup.length +'条逾期数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let idval = '';
            for(let i = 0; i < this.dataBackup.length ;i++){
              if( i != this.dataBackup.length -1){
                idval += this.dataBackup[i].id + ',' 
              }else{
                idval += this.dataBackup[i].id
              }
            }
            let params={
              type:this.typeval
            }
            getUpdateList( idval,params ).then(res => {
              if(res.data.code == 200){
                this.$message({
                  type: 'success',
                  message: res.data.data
                });
                this.typeval='';
                this.batchClear(1);
                this.getUserList();
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.msg
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '操作取消!'
            });
          });
        }

        if(this.flag2 == false){
          this.$confirm('请确认是否要批量通过审核'+ this.dataBackup.length +'条数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let idval = '';
            for(let i = 0; i < this.dataBackup.length ;i++){
              if( i != this.dataBackup.length -1){
                idval += this.dataBackup[i].id + ',' 
              }else{
                idval += this.dataBackup[i].id
              }
            }
            let params={
              type:this.typeval
            }
            getUpdateList( idval,params ).then(res => {
              if(res.data.code == 200){
                this.$message({
                  type: 'success',
                  message: res.data.data
                });
                this.typeval='';
                this.batchClear(2);
                this.getUserList();
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.msg
                });
              }
            })
          }).catch(() => {
  
            this.$message({
              type: 'info',
              message: '操作取消!'
            });
          });
        }
      }else{
        this.$message({
          showClose: true,
          message: '请选择至少一条数据',
          type: 'error',
          duration:1500
        });
      }
    },
    cancelBtn(){
      //复选框 取消按钮
      if(this.flag1 == false){
        this.$message({
          showClose: true,
          message: '已取消操作',
          duration:1000
        });
        this.flag1 = true
        this.disabled2 = false
      }
      if(this.flag2 == false){
        this.$message({
          showClose: true,
          message: '已取消操作',
          duration:1000
        });
        this.flag2 = true
        this.disabled1 = false
      }

        this.checkBox = false;
    },
    downloadXls(){
      getdownload().then(res => {
        // console.log(res.data.data);
        if(res.status == 200){
          // 导出报表
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            // const tHeader = ['序号','ID','月结日期','会员名','月结发钱','预代扣税','技术服务费','会员上月应提现金额','会员额外奖励','违约金额','应缴金额','已收金额','未收金额','冻结金额','缴纳状态','审核状态','操作人','操作时间']
            const tHeader = ['','','','','','','','','','','','','','','','','','']
            const filterVal =['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16',]
            const data = this.formatJson(filterVal, res.data.data)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'table-list'
            })
            this.downloadLoading = false
          })
        }
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    //缴款明细操作 通过
    JkmxTongguo(index, row) {
      this.$confirm('￥'+ row.amount, '请核实该会员是否已打款?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let params = {
          amount:row.amount,
          status:1
        };
        getShTransferList( row.id,params ).then(res => {
        // console.log(res);
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.lookmingxi = false;//关闭明细窗口
            this.getUserList();
          }else{
            this.$message({
              type: 'error',
              message: '请求出错了'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消!'
        });
      });
    },
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
  .r_box {
    min-width: 900px;
    li {
      float: left;
      margin-right: 10px;
    }
  }
}
.main {
  .tab_foot {
    .shanshu {
      display: inline-block;
      margin-top: 30px;
    }
    .block {
      float: right;
      margin:30px 60px 0 0;
    }
  }
}
</style>
<style >
  .el-dialog{
    padding-bottom: 20px;
  }
</style>
