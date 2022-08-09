
<template>
<el-container v-loading="mallcommentlistLoading" >
  <el-header class="tit">
    <div class="l_box">
      <ul>
        <li>
          <el-button type="text" @click="xzpl">【新增评论】</el-button>
          <NewComments v-if="xzplshow" @xzplClose="xzplClose" @newCommentdata = newCommentdata></NewComments>
        </li>
      </ul>
    </div>
    <div class="r_box">
      <ul>
        <li style="padding-top:1px;margin-right:15px;">
          会员名 :
          <el-input style="width:180px;" clearable size="small" v-model="shuruhuiyuanval">
          </el-input>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchmall">搜索</el-button>
        </li>
        <li>
          <p style="line-height:34px;letter-spacing:1px;font-weight:500;">共有{{total}}条记录</p>
        </li>
      </ul>
    </div>
  </el-header>

  <el-main class="main">

    <el-table
      border 
      size="small" 
      :data="mallcommentlist" 
      tooltip-effect="dark" 
      style="width: 100%; text-align:center"
      @selection-change="xuanzeshuju"
      @sort-change="mallsort">
      <el-table-column type="selection" width="40">
      </el-table-column>
      <el-table-column prop="mall.title" label="商城名">
      </el-table-column>
      <el-table-column label="会员名" >
        <template slot-scope="scope">
          <el-button 
            type="text" 
            size="small" 
            @click="toUserdata(scope.$index,scope.row)">
              {{ scope.row.user.ddusername }}
            </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" min-width="200">
      </el-table-column>
      <el-table-column prop="addtime" label="添加时间" min-width="90" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope">
          <el-button type="text" size="small" @click="xgpl(scope.$index,scope.row)">修改</el-button>
        </div>
      </el-table-column>

    </el-table>

    <div class="tab_foot">
      <div class="shanshu">
        <el-button 
          type="danger" 
          style="letter-spacing:2px;font-size:16px;" 
          size="small"
          @click="delmalldata">删除</el-button>
      </div>
      <div class="block">
        <el-pagination 
          background 
          @current-change="handleCurrentChange" 
          :current-page="mallcommentQuery.page" 
          :page-size="15" 
          layout="prev, pager, next, jumper" 
          :total="total">
        </el-pagination>
      </div>
    </div>
  </el-main>
  <!-- 修改评论组件 -->
  <ReviseTheComment v-if="xgplshow" @xgplClose="xgplClose" :ReviseTheCommentdata="ReviseTheCommentdata"></ReviseTheComment>
</el-container>
</template>

<script>
import { fetchMallCommentList,fetchDelmalldata } from '@/api/mall_comments'

import NewComments from './NewComments'
import ReviseTheComment from './ReviseTheComment'

export default {
  name: 'mall_comment_list',
  components:{
    NewComments,
    ReviseTheComment
  },
  props: {

  },
  data() {
    return {
      recordval: 0,
      ReviseTheCommentdata:{},//评论修改数据的存放
      mallcommentlist: [],//请求的商城评论数据
      mallcommentlistLoading: true,
      total: 0,
      xzplshow:false,//新增评论
      xgplshow:false,//修改评论
      shuruhuiyuanval:'',//会员输入的值
      mallcommentQuery:{
        page:1,
        filter:'id;mall_id;uid;content;addtime',
        orderBy: 'id',//按照什么来排
        sortedBy: 'asc',//asc 正序  desc 倒序
        search: '',
        searchJoin:'and',//and 和 or或者  
        searchFields:'', //加入字段,快速列表
      },//去请求的字段
    }
  },
  //计算的属性computed 依赖缓存
  // computed:{
  //   getmallcommentlist() {
  //     //请求商城评论的数据
  //     this.mallcommentlistLoading = true
  //     fetchMallCommentList(this.pagenumber).then(res => {
  //       console.log(res.data);
  //       this.total = res.data.total;
  //       this.mallcommentlist = res.data.data;
  //       this.mallcommentlist.map((item,index) =>{
  //         var times = new Date(item.addtime * 1000);
  //         // console.log(times);
  //         var Year  = times.getFullYear(); // 获取完整的年份(4位,1970)
  //         var Month = times.getMonth() + 1; // 获取月份(0-11,0代表1月)
  //         var Dates = times.getDate(); // 获取日(1-31)
  //         var Hours = times.getHours(); // 获取小时数(0-23)
  //         var Minutes = times.getMinutes(); // 获取分钟数(0-59)
  //         var Seconds = times.getSeconds(); // 获取秒数(0-59)
  //         item.addtime = Year + '-' + Month + '-' + Dates + ' ' + Hours + ':' + Minutes + ':' + Seconds;
  //         console.log(item.addtime);
  //       })
  //       this.mallcommentlistLoading = false;
  //     })
  //   }
  // },
  created() {
    this.getmallcommentlist()
  },
  methods: {
    xzpl(){
      this.xzplshow = true;//新增评论展示
    },
    xzplClose: function(xzplshow){
      this.xzplshow = xzplshow;
    },
    newCommentdata (item) {
      this.mallcommentlist.push(item);
      this.getmallcommentlist();
    },
    xgpl(index,row){
      this.xgplshow = true;//修改评论展示
      //用户选择数据得到，然后传给子组件
      this.ReviseTheCommentdata = row;
      console.log(this.ReviseTheCommentdata);
    },
    xgplClose: function(xgplshow){
      this.xgplshow = xgplshow;//接受子组件

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.mallcommentQuery.page = val;
      this.getmallcommentlist();
    },
    getmallcommentlist() {
      //请求商城评论的数据
      this.mallcommentlistLoading = true
      fetchMallCommentList(this.mallcommentQuery).then(res => {
        console.log(res.data);
        this.total = res.data.total;
        this.mallcommentlist = res.data.data;

        this.mallcommentlist.map((item,index) =>{
          //循环数据时间戳改为正常时间
          var times = new Date(item.addtime * 1000);
          // console.log(times);
          var Year  = times.getFullYear(); // 获取完整的年份(4位,1970)
          var Month = times.getMonth() + 1; // 获取月份(0-11,0代表1月)
          var Dates = times.getDate(); // 获取日(1-31)
          var Hours = times.getHours(); // 获取小时数(0-23)
          var Minutes = times.getMinutes(); // 获取分钟数(0-59)
          var Seconds = times.getSeconds(); // 获取秒数(0-59)
          item.addtime = Year + '-' + Month + '-' + Dates + ' ' + Hours + ':' + Minutes + ':' + Seconds;
          // console.log(item.addtime);
        })
        this.mallcommentlistLoading = false;
      })
    },
    xuanzeshuju(val){
      //选择评论数据
      console.log(val);
      this.newdelmalldata = val;
    },
    delmalldata(){
      //删除评论
      this.$confirm('确认是要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.mallcommentlistLoading = true
        this.newdelmalldata.map((item,index) => {
          var mallid = item.id;
          fetchDelmalldata(mallid).then(res => {
            this.mallcommentlistLoading = false
            console.log(res.data);
            this.getmallcommentlist();
          })
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        this.mallcommentlistLoading = false
      });
    },
    //搜索
    searchmall(){
      //如果输入框为空
      if(this.shuruhuiyuanval == ''){
        this.mallcommentQuery.search = '';
        this.mallcommentQuery.searchFields ='';
      }else{
        this.mallcommentQuery.search = 'user.ddusername:' + this.shuruhuiyuanval;
        this.mallcommentQuery.searchFields = 'user.ddusername:=';
      }
      this.mallcommentQuery.page = 1;
      this.getmallcommentlist();
    },
    //排序
    mallsort(val){
      this.mallcommentQuery.orderBy = val.prop;
      this.getmallcommentlist();
    },
    toUserdata(index, row){
      console.log(index);
      console.log(row.user.ddusername);
      var userddname = row.user.ddusername
      this.$router.push({path:'LookUser'})
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
    float: right;
    margin-right: 20px;
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
</style>
