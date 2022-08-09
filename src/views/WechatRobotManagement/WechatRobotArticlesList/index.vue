<template>
<el-container>
  <el-header class="tit">
    <div class="l_box">
      <ul>
        <li>
          <el-button type="primary" plain size="small" @click="searchuser">指令新增</el-button>
        </li>
      </ul>
    </div>
    <div class="r_box">
      <ul>
        <li>
          触发词搜索：
          <el-input style="width:150px;" clearable size="small" placeholder="请输入会员名" v-model="searchuserQuery.usernameval"></el-input>
        </li>
        <li>
          关键词搜索：
          <el-input style="width:150px;" clearable size="small" placeholder="请输入会员名" v-model="searchuserQuery.usernameval"></el-input>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchuser">搜索</el-button>
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
      <el-table-column
        prop="a"
        label="ID"
        min-width="15">
      </el-table-column>
      <el-table-column
        prop="b"
        label="触发关键词"
        min-width="30">
      </el-table-column>
      <el-table-column
        prop="c"
        label="回复内容"
        min-width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="40">
          <div slot-scope="scope">
            <el-button type="primary" size="small" @click="bianji(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="shanchu(scope.$index,scope.row)">删除</el-button>
          </div>
      </el-table-column>
    </el-table>


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

export default {
  name: 'WechatRobotArticlesList',//微信机器人文章列表
  data() {
    return {
      userlist: [
        {
          a:'60',
          b:'团队',
          c:'您好会员：[qq][n]自购收益：[fx_money][n]收入汇总：[ye_money][n]提现中：[tx_money][n]已提现：[tbyitixian]',
        },
        {
          a:'55',
          b:'团队',
          c:'您的直接推荐人共有：[one]个[n]朋友圈共有[haoyou]个[n]有效会员[level_haoyou]个[n]',
        },
      ], 
      userlistLoading: false,
      total: 0,
      searchuserQuery:{
        // sqvalue:'',
        // shvalue:'',
        usernameval:'',
      },
      listQuery: {
        page:1,
        limit: 10,
      },
    }
  },
  computed:{
    
  },
  created(){
    // this.getUserList();
  },
  methods: {
    getUserList() {
      //会员列表信息
      this.userlistLoading = true
      getList(this.listQuery).then(res => {
        // console.log(res);
        // if(res.data.code == 200){

        // }
        this.userlistLoading = false
      })
    },
    handleCurrentChange(val) {
      //刷新分页信息
      // console.log(`当前页: ${val}`)
      this.listQuery.page = val;
      this.getUserList();
    },
    bianji(){
      //编辑

    },
    shanchu(){
      //删除

    },
    searchuser(){
      //查询
    //   this.listQuery.user =  this.searchuserQuery.usernameval;//会员名
    //   this.listQuery.accreditStatus =  this.searchuserQuery.sqvalue;//授权状态
    //   this.listQuery.status = this.searchuserQuery.shvalue;//审核状态
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
  padding: 0 15px;
  .l_box {
    li {
      float: left;
      margin-right: 10px;
    }
  }
  .r_box {
    float: right;
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