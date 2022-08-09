
<template>
<el-container v-loading="msglistLoading">
  <el-header class="tit">
    <div class="l_box">
      <ul>
        <li>
          <el-button type="text">【发送站内信】</el-button>
        </li>
      </ul>
    </div>
    <div class="r_box">
      <ul>
        <li>
          <el-button type="primary" size="small">未查看站内信</el-button>
        </li>
        <li>
          会员名 :
          <el-input style="width:150px;" clearable size="small">
          </el-input>
        </li>
        <li>
          <el-select clearable v-model="xxvalue" style="width:105px;" size="small">
            <el-option v-for="item in xx" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search" size="small">搜索</el-button>
        </li>
        <li>
          <p style="line-height:34px;letter-spacing:1px;font-weight:500;">共有{{total}}条记录</p>
        </li>
      </ul>
    </div>
  </el-header>

  <el-main class="main">

    <el-table border size="small"  :data="msglist" tooltip-effect="dark" style="width: 100%; text-align:center">
      <el-table-column type="selection" width="35">
      </el-table-column>
      <el-table-column prop="see" label="状态" min-width="20">

      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="40">

      </el-table-column>
      <el-table-column prop="content" label="内容"  min-width="200">

      </el-table-column>
      <el-table-column prop="user.ddusername" label="发件人" min-width="40">

      </el-table-column>
      <el-table-column prop="senduser" label="接待客服" min-width="40">

      </el-table-column>
      <el-table-column prop="addtime" label="发送时间" min-width="50">

      </el-table-column>
      <el-table-column label="执行操作" min-width="40">
        <div slot-scope="scope">
          <el-button type="text" size="small">阅读</el-button>
        </div>
      </el-table-column>

    </el-table>

    <div class="tab_foot">
      <div class="shanshu">
        <el-button type="danger" style="letter-spacing:2px;font-size:16px;" size="small">删除</el-button>
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
import {fetchMsgList} from '@/api/msglist'

export default {
  name: 'msg_list',
  props: {

  },
  data() {
    return {
      msglist: [],
      msglistLoading:true,
      pagenumber:1,
      total:0,
      xx: [{
        value: 'shj',
        label: '收件人'
      }, {
        value: 'fjr',
        label: '发件人'
      }, {
        value: 'wck',
        label: '未查看'
      }],
      xxvalue: ''

    }
  },
  created() {
    this.getmsgList()
  },
  methods: {
    getmsgList() {
      this.msglistLoading = true
      fetchMsgList(this.pagenumber).then(res => {
        console.log(res.data);
        this.msglist = res.data.data
        this.total = res.data.total
        this.msglistLoading = false
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenumber = ` ${val}`
      this.getmsgList()
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
  width: 100%;
  padding: 0 0 10px 15px;
  height: 0 !important;
  .l_box {
    li {
      height: 10px;
      float: left;
      font-weight: 600;
      color: #666;
      letter-spacing: 1.5px;
      line-height: 26px;
    }
  }
  .r_box {
    float: right;
    margin-right: 2%;
    li {
      float: left;
      margin-right: 10px;
    }
  }
}
.main {
  padding: 65px 25px 25px 15px !important;
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
      transform:translate(0,20%);
      margin-left:20%;
      display: inline-block;
    }
  }
}
</style>
