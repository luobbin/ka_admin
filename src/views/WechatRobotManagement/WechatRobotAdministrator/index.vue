<template>
<el-container>
  <el-header class="tit">
    <div class="l_box">
      <ul>
        <li>
          <el-button plain type="primary" size="small" @click="searchuser">微信机器人管理员新增</el-button>
        </li>
      </ul>
    </div>
    <div class="r_box">
      <ul>
        <li>
          机器人微信ID：
          <el-input style="width:150px;" clearable size="small" placeholder="请输入会员名" v-model="searchuserQuery.usernameval"></el-input>
        </li>
        <li>
          会员微信ID：
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
        label="序号"
        min-width="20">
      </el-table-column>
      <el-table-column
        prop="b"
        label="机器人微信ID">
      </el-table-column>
      <el-table-column
        prop="c"
        label="会员微信ID">
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
  name: 'WechatRobotAdministrator',//微信机器人管理员
  data() {
    return {
      userlist: [
        {
          a:'9',
          b:'wxid_cins9pd82l9a22',
          c:'wxid_qj00os1oo36622',
        },
        {
          a:'9',
          b:'wxid_cins9pd82l9a22',
          c:'wxid_qj00os1oo36622',
        },
        {
          a:'7236982',
          b:'18162998417',
          c:'wxid_uvmchdcmedx822',
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