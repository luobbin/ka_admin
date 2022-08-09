<template>
<el-container>
  <el-header class="tit">
    <div class="r_box">
      <ul>
        <li>
          <el-select class="item-choose" v-model="searchuserQuery.sqvalue" size="small" style="width:125px;" clearable placeholder="授权状态">
            <el-option v-for="item in sqOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
      </ul>
    </div>
  </el-header>

  <el-main class="main">

    <el-table 
      border 
      size="small" 
      :data="userlist" 
      v-loading="userlistLoading" 
      highlight-current-row 
      tooltip-effect="dark" 
      style="text-align:center;">
      <el-table-column label="序号" width="45" prop="index">
      <!-- <el-table-column label="id" width="70" prop="id" sortable="custom"> -->
        <!-- <template slot-scope="scope">{{ scope.row.id }}</template>-->
      </el-table-column>
      <el-table-column
        prop="user.ddusername"
        label="会员名">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        min-width="88">
      </el-table-column>
      <el-table-column
        prop="account"
        label="阿里妈妈账号"
        min-width="88">
      </el-table-column>
      <el-table-column
        label="身份证"
        min-width="92">
        <template slot-scope="scope">
          <el-popover
            placement="right-start"
            width="430"
            trigger="click">
              <img style="width:400px;height:auto;" border="0" :src="scope.row.cardImg[0]" alt="身份证">
            <img style="width:32px;height:auto;" border="0" :src="scope.row.cardImg[0]" alt="身份证" title="点击查看身份证大图" slot="reference">
          </el-popover>
          <el-popover
            placement="right-start"
            width="430"
            trigger="click">
              <img style="width:400px;height:auto;" border="0" :src="scope.row.cardImg[1]" alt="身份证">
            <img style="width:32px;height:auto;" border="0" :src="scope.row.cardImg[1]" alt="身份证" title="点击查看身份证大图" slot="reference">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="idcard"
        label="身份证号"
       >
      </el-table-column>
      <el-table-column
        prop="wechat"
        label="微信号"
        >
      </el-table-column>
      <el-table-column
        label="拉新图">
        <template slot-scope="scope">
          <el-popover
            placement="right-start"
            width="430"
            trigger="click">
              <img style="width:400px;height:auto;" border="0" :src="scope.row.laxin" alt="拉新图">
            <img style="width:32px;height:auto;" border="0" :src="scope.row.laxin" alt="拉新图" title="点击查看拉新图大图" slot="reference">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="agreement"
        label="合同签署">
      </el-table-column>
      <el-table-column
        prop="AccountExec"
        label="授权状态"
        >
      </el-table-column>
      <el-table-column
        prop="time"
        label="授权时间"
        >
      </el-table-column>
      <el-table-column
        prop="pid"
        label="PID"
        >
      </el-table-column>
      <el-table-column
        prop="pidData"
        label="PID获取状态"
        >
      </el-table-column>
      <el-table-column
        prop="gy_status"
        label="高佣状态"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="审核状态"
       >
      </el-table-column>
      <el-table-column
        prop="refuse_reason"
        label="驳回原因"
        >
      </el-table-column>

      <el-table-column
        label="操作"
        min-width="160">
          <div slot-scope="scope" v-if="scope.row.status !=='已审核'">
            <el-button type="text" size="small" @click="tongguo(scope.$index,scope.row)">通过</el-button>
            <el-button type="text" size="small" @click="bohui(scope.$index,scope.row)">驳回</el-button>
            <el-button type="text" size="small" @click="gaoyong(scope.$index,scope.row),ifgaoyong = true">高佣状态设置</el-button>
          </div>
      </el-table-column>
    </el-table>

    <!-- 高佣弹窗 -->
    <el-dialog title="高佣审核" :visible.sync="ifgaoyong" :before-close="handleClose">
        <el-select v-model="gaoyongval" placeholder="请审核高佣状态">
          <el-option label="正常" value="1"></el-option>
          <el-option label="失效" value="0"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ifgaoyongFalse">取 消</el-button>
          <el-button type="primary" @click="ifgaoyongTrue">确 定</el-button>
        </div>
    </el-dialog>

      <div class="tab_foot">
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
import { getList,getUpdateUserList } from '@/api/xiaoai'
import { parseTime, parseDate } from '@/utils'

const sqOptions = [
  { value: '', label: '全部' }, 
  { value: '0', label: '未授权' }, 
  { value: '1', label: '已授权' }, 
  { value: '2', label: '授权失效'}
]
const shOptions = [
  { value: '', label: '全部' }, 
  { value: '6', label: '待审核' }, 
  { value: '7', label: '已审核' }, 
  { value: '8', label: '驳回'}
]

export default {
  name: 'AliMMInformation',
  data() {
    return {
      valtong:false,
      gaoyongid:'',//高拥id
      gaoyongval:'',//高拥状态
      ifgaoyong:false,//高拥弹出层
      userlist: [], 
      userlistLoading: false,
      sqOptions,
      shOptions,
      total: 0,
      searchuserQuery:{
        sqvalue:'',
        shvalue:'',
        usernameval:'',
      },
      listQuery: {
        page:1,
        limit: 10,
        accreditStatus:'',//授权状态
        status:'',//审核状态
      },
    }
  },
  computed:{
    
  },
  created(){
    this.getUserList();
  },
  methods: {
    getUserList() {
      //会员列表信息
      this.userlistLoading = true
      getList(this.listQuery).then(res => {
        // console.log(res);
        if(res.data.code == 200){
          if(res.data.data.items !== ''){
            this.userlist = res.data.data.items
            this.total = res.data.data.total

            for(let i = 0; i< this.userlist.length ;i++){
              //序号
              this.userlist[i].index = (res.data.data.currentPage != 1 ? res.data.data.currentPage * 10-9:1 ) + i;
  
              //授权状态判断 AccountExec 大于29天 授权失效 小于 已授权 没有这个字段 未授权
              // 获取数据的日期，时间戳 parseDate(this.userlist[i].time) 30天的时间戳2678400 
              
              if(this.userlist[i].time !== null){
                if( parseDate(this.userlist[i].time) + 2505600 > parseDate(new Date()) ){
                  this.userlist[i].AccountExec = '已授权'
                }else if( parseDate(this.userlist[i].time) + 2505600 < parseDate(new Date()) ){
                  this.userlist[i].AccountExec = '授权失效'
                }
              }else{
                this.userlist[i].AccountExec = '未授权'
              }
              
              if(this.userlist[i].pid !== '未提交' ){
                this.userlist[i].pidData = '已获取' 
              }else{
                this.userlist[i].AccountExec = '未授权'
                this.userlist[i].pidData = '未获取'  
              }
  
              //agreement 0未签署  1已签署   2已补充个人信息  3 已验证手机号   4已提交申请   5已审核成功  6审核失败
              if( this.userlist[i].agreement == 1){
                this.userlist[i].agreement = '已签署'
              }else{
                this.userlist[i].agreement = '未签署'
              }
              
              //gy_status高佣状态  0失效  1正常
              if(this.userlist[i].gy_status == 0){
                this.userlist[i].gy_status='失效'
              }else if(this.userlist[i].gy_status == 1){
                this.userlist[i].gy_status='正常'
              }
  
              //status 审核状态
              if(this.userlist[i].status == null){
                this.userlist[i].status = ''
              }else if(this.userlist[i].status == 6){
                this.userlist[i].status = '待审核'
              }else if(this.userlist[i].status == 7 ||this.userlist[i].status == 10||this.userlist[i].status == 9){
                this.userlist[i].status = '已审核'
              }else if(this.userlist[i].status == 8){
                this.userlist[i].status = '已驳回'
              }
  
            }
          }
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
      // console.log(row.status);
      this.$confirm('确认要通过该会员申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //【身份证图至少2张】【身份号码是否提供】【微信号是否提供】【PID是否过期】
        // console.log(row.cardImg.length);
        // console.log(row.idcard);
        // console.log(row.wechat);
        // console.log(row.agreement);
        // console.log(row.AccountExec);
        // console.log(row.gy_status);
        // console.log(row.pidData);
        var flag = 0;
        if( row.cardImg.length !==2 ){
          flag+=1
        }
        if( row.idcard ==''||row.idcard ==null ){
          flag+=1
        }
        if( row.wechat ==''||row.idcard ==null){
          flag+=1
        }
        if( row.pid =='未提交'||row.pid==null ){
          flag+=1
        }
        if( row.user.ddusername==''||row.user.ddusername==null ){
          flag+=1
        }
        if( row.mobile==''||row.mobile==null ){
          flag+=1
        }
        if( row.account==''||row.account==null){
          flag+=1
        }
        if( row.laxin==''||row.laxin==null ){
          flag+=1
        }
        if( row.agreement !=="已签署" ){
          flag+=1
        }
        if( row.AccountExec !=="已授权" ){
          flag+=1
        }
        if( row.time==''||row.time==null ){
          flag+=1
        }
        if( row.time==''||row.time==null ){
          flag+=1
        }
        if( row.gy_status!=='正常' ){
          flag+=1
        }
        if( row.pidData!=='已获取' ){
          flag+=1
        }
        if(row.cardImg.length==2&&row.idcard!==''&&row.wechat!==''&&row.pid!==null&&row.user.ddusername!==''&&row.mobile!==''&&row.account!==''&&row.laxin!==''&&row.agreement=="已签署"&&row.AccountExec=="已授权"&&row.time!==""&&row.gy_status=="正常"&&row.pidData=="已获取"){
          let params={
            pid: row.pid,
            status:7
          }
          getUpdateUserList( row.id,params ).then(res => {
            // console.log(res);
            if(res.status == 200){
              this.$message({
                type: 'success',
                message: res.data.data
              });
              this.getUserList();
            }else{
              this.$message({
                type: 'error',
                message: '请求失败'
              });
            }
          })
        }else{
          this.$message({
            type: 'error',
            message: flag + '事件不合格，不允许通过!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消!'
        });
      });
    },
    //操作 驳回
    bohui(index, row){
      this.$prompt('请输入驳回原因', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/\S/,
          inputErrorMessage: '内容不能为空',
        }).then(({ value }) => {
          let params={
            refuse_reason: value,
          };
          getUpdateUserList( row.id,params ).then(res => {
            if(res.status == 200){
              this.$message({
                type: 'success',
                message: res.data.data,
                duration:1500
              });
              this.getUserList();
            }else{
              this.$message({
                type: 'error',
                message: '请求失败'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          });       
        });
    },
    //操作 高俑状态设置
    gaoyong(index, row){
      this.gaoyongval = '';
      this.gaoyongid = this.userlist[index].id;
    },
    handleClose(done) {
      this.$confirm('确认关闭高俑状态设置？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    ifgaoyongFalse(){
      //高拥弹窗 取消按钮
      this.ifgaoyong = false;
      this.$message({
        type: 'info',
        message: '操作已取消'
      });
    },
    ifgaoyongTrue(){
      //高拥弹窗 确定按钮
      if(this.gaoyongval !== ''){
        this.ifgaoyong = false;
        this.gaoyongval={
          gy_status:this.gaoyongval
        }
        getUpdateUserList( this.gaoyongid,this.gaoyongval ).then(res => {
          // console.log(res);
          if(res.data.code == 200){
            this.getUserList();
            this.$message({
              type: 'success',
              message: '操作成功'
            });
          }
        })
      }else{
        this.$message({
          type: 'error',
          message: '请选择状态',
          duration:1500
        });
      }
    },
    searchuser(){
      //查询
      this.listQuery.user =  this.searchuserQuery.usernameval;//会员名
      this.listQuery.accreditStatus =  this.searchuserQuery.sqvalue;//授权状态
      this.listQuery.status = this.searchuserQuery.shvalue;//审核状态
      this.getUserList();
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
      margin-left: 10px; // border-left:1px solid #f5f5f5;  
    }
    .block {
      float: right;
      margin:30px 60px 0 0;
      // display: inline-block;
    }
  }
}
</style>