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
          <el-select class="item-choose" v-model="searchuserQuery.shvalue" size="small" style="width:105px;" clearable placeholder="审核状态">
            <el-option v-for="item in shOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
        <li>
          手机号
          :
          <el-input style="width:150px;" clearable size="small" placeholder="请输入手机号" v-model="searchuserQuery.telval">
          </el-input>
        </li>
        <li>
          支付宝订单号
          :
          <el-input style="width:150px;" clearable size="small" placeholder="请输入支付宝订单号" v-model="searchuserQuery.alipaylistval">
          </el-input>
        </li>
        <li>
          <el-input style="width:150px;" clearable size="small" placeholder="请输入会员名" v-model="searchuserQuery.usernameval"></el-input>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchuser">查询</el-button>
        </li>
        <li>
          <el-upload
            class="upload-file"
            ref="upload"
            name="thef"
            :multiple="false"
            action="https://other.aikbao.com/admin/v1/baobiao"
            :before-upload="beforeAvatarUpload"
            :on-success="AvatarUploadSuccess"
            :on-error="AvatarUploadError"
            :file-list="fileList"
            :show-file-list="false"
            :headers="headerObj"
            :auto-upload="true">
            <el-button size="small" type="primary" icon="el-icon-upload">导入会员账期明细</el-button>
            <!-- <div slot="tip" class="el-upload__tip" >只能上传xsl文件，且不超过20M</div> -->
          </el-upload>
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
      <el-table-column label="序号" width="60" prop="index" >
      </el-table-column>
      <el-table-column
        prop="time"
        label="月结日期"
        min-width="72">
      </el-table-column>
      <el-table-column
        prop="ddusername"
        label="会员名"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="bill_num"
        label="支付宝订单号"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="支付宝转账金额"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="comment"
        label="支付宝备注"
        min-width="140">
      </el-table-column>
      <el-table-column
        prop="pay_time"
        label="支付宝打款时间"
        min-width="122">
      </el-table-column>
      <el-table-column
        prop="realname"
        label="支付宝姓名"
        min-width="85">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="receivable"
        label="应收金额">
      </el-table-column>
      <el-table-column
        prop="already_money"
        label="已收金额"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="re_money"
        label="未收金额"
        min-width="70">
      </el-table-column>
      <el-table-column
        prop="status"
        label="审核状态"
        min-width="70">
      </el-table-column>
      <el-table-column
        prop="admin"
        label="操作人"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="dotime"
        label="操作时间"
        min-width="85">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="70">
          <div slot-scope="scope">
            <el-button type="text" size="small" @click="tongguo(scope.$index,scope.row),ifUserReceipts = true" v-if="scope.row.status !=='已通过'">通过</el-button>
          </div>
      </el-table-column>
    </el-table>
    
    <!-- 会员账期 -->
    <el-dialog title="请核实该会员是否已全部打款" :visible.sync="ifUserReceipts" width="300px" :before-close="handleClose">
        <p style="margin:-5px 0 10px 0;">￥<span v-text="UserReceipts.je"></span></p>
        <el-input style="width:220px;margin:0px 0 15px 0" clearable placeholder="请输入会员名" v-model="UserReceipts.hym"></el-input>
        <el-date-picker
          v-model="UserReceipts.rq"
          type="month"
          placeholder="选择日期时间"
          value-format="yyyy-MM">
        </el-date-picker>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ifUserReceiptsTrue">确 定</el-button>
          <el-button @click="ifUserReceipts = false">取 消</el-button>
        </div>
    </el-dialog>

      <div class="tab_foot">
        <div class="block">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-size="listQuery.limit"
            layout="total,prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-main>

</el-container>
</template>

<script>
import { parseTime, parseDate } from '@/utils'
import { getUserTransferList, } from '@/api/xiaoai'
import { getShTransferList } from '@/api/xiaosun'
import { getToken } from '@/utils/auth'

const shOptions = [
  { value: '', label: '全部' }, 
  { value: '6', label: '待审核' }, 
  { value: '7', label: '已审核' }, 
]

export default {
  name: 'UserReceiptsDetails',
  data() {
    return {
      headerObj:{},
      fileList:[],
      userlist: [], 
      userlistLoading: false,
      total: 0,
      shOptions,
      ifUserReceipts:false,//会员账期层展示
      UserReceipts:{
        id:'',
        je:'',
        hym:'',
        rq:'',
      },
      searchuserQuery:{
        dataval:'',//选择的时间值
        shvalue:'',//审核状态
        telval:'',//手机号
        alipaylistval:'',//支付宝订单号
        usernameval:'',//会员名
        search: '',
        searchFields: '',
      },
      listQuery: {
        page:1,
        limit: 10,
        time: '',
        mobile: '',
        status: '',
        bill_num: '',
        user: '',
      },
     }
  },
  created(){
    this.getUserList();
    let Authorizationval = getToken();
    // console.log(1);
    this.headerObj = {
      Authorization : Authorizationval
    };
    // console.log(this.headerObj);
  },
  methods: {
    beforeAvatarUpload(file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const extension3 = file.name.split('.')[1] === 'csv'
      if (!extension && !extension2 && !extension3) {
        this.$message.error('上传文件只能是xls,xlsx,csv格式!'); 
      }
      
    },
    AvatarUploadSuccess(res, file, fileList){
      //文件上传成功的钩子
      // console.log(res);
      // console.log(file);
      // console.log(fileList);
      if(file.response.code == -1){
        this.$message({
          type: 'success',
          message:file.msg,
          duration:2000
        });
      }
      if(file.response.code == 200){
        this.$message({
          type: 'success',
          message:file.name+'报表导入成功!',
          duration:2000
        });
        this.getUserList();
      }
    },
    AvatarUploadError(res, file, fileList){
      // console.log(res);
      // console.log(file);
      // console.log(fileList);
    },
    getUserList() {
      //会员列表信息
      this.userlistLoading = true
      getUserTransferList(this.listQuery).then(res => {
        // console.log(res);
        if(res.data.code == 200){
          if(res.data.data.data !== ''){
            this.userlist = res.data.data.items
            this.total = res.data.data.total
            for(let i = 0; i< this.userlist.length ;i++){
              //序号
              this.userlist[i].index = (res.data.data.currentPage != 1 ? res.data.data.currentPage * 10-9:1 ) + i;
              //操作时间戳转换
              if(this.userlist[i].dotime !== null){
                this.userlist[i].dotime = parseTime(this.userlist[i].dotime)
              }
              //支付宝打款时间戳转换
              if(this.userlist[i].pay_time !== null){
                this.userlist[i].pay_time = parseTime(this.userlist[i].pay_time)
              }

              //审核状态
              if(this.userlist[i].status == 1){
                this.userlist[i].status = '已通过'
              }
              if(this.userlist[i].status == 0){
                this.userlist[i].status = '未通过'
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
    tongguo(index, row) {
      // console.log(this.UserReceipts);
      this.UserReceipts.rq = '';
      this.UserReceipts.hym = '';
      //操作 通过
      // console.log(index,row);
      //已收金额
      this.UserReceipts.je = row.amount;
      this.UserReceipts.id = row.id;
      // console.log(this.UserReceipts);
    },
    handleClose(done) {
      this.$confirm('确认关闭弹出窗口？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //会员账期 确定按钮
    ifUserReceiptsTrue(){
      if( this.UserReceipts.hym!='' && this.UserReceipts.rq!='' ){
        let params = {
          status:1,
          time:this.UserReceipts.rq +'-20',
          user:this.UserReceipts.hym,
          amount:this.UserReceipts.je,
        };
        // console.log(this.UserReceipts.id);
        // console.log(params);     
        getShTransferList( this.UserReceipts.id,params ).then(res => {
        // console.log(res);
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.ifUserReceipts = false;//关闭明细窗口
            this.getUserList();
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg,
              duration:1000
            });
          }
        })
      }else{
        this.$message({
          type: 'error',
          message: '请输入会员名或选择会员账期日期',
          duration:1000
        });
      }
    },
    searchuser(){
      this.listQuery.time =  this.searchuserQuery.dataval;//时间值
      this.listQuery.mobile =  this.searchuserQuery.telval;//手机号
      this.listQuery.status = this.searchuserQuery.shvalue;//审核状态
      this.listQuery.bill_num =  this.searchuserQuery.alipaylistval;//支付宝订单号
      this.listQuery.user =  this.searchuserQuery.usernameval;//会员名
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