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
  padding: 60px 18px 30px 18px !important;
  .tab_foot {
    width: 100%;
    height: 60px;
    border: 1px solid #f5f5f5;
    border-top: 0;
    padding-top: 12px;
    .t_l {
      padding-left: 8px;
      display: inline;
    }
    .shanshu {
      display: inline;
      margin-left: 30px; // border-left:1px solid #f5f5f5;  
    }
  }
  .el-footer {
    padding: 0;
  }
}

.block {
  margin: 0 auto;
  margin-bottom: 30px;
}
</style>

<template>
<el-container>
  <el-header class="tit">
    <div class="l_box">
      <ul>
        <li>

        </li>
      </ul>
    </div>
    <div class="r_box">
      <ul>
        <li>
          评论人 :
          <el-input style="width:150px;" clearable>
          </el-input>
        </li>
        <li>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </li>
        <li>
          <p style="line-height:34px;letter-spacing:1px;font-weight:500;">共有{{recordval}}条记录</p>
        </li>
      </ul>
    </div>
  </el-header>

  <el-main class="main">

    <el-table border ref="multipleTable" :data="goodcommentlist" v-loading="goodcommentlistLoading" tooltip-effect="dark" style="width: 100%; text-align:center">
      <el-table-column type="selection" width="35">
      </el-table-column>
      <el-table-column prop="" label="主标题" min-width="120">

      </el-table-column>
      <el-table-column prop="" label="评论人">

      </el-table-column>
      <el-table-column prop="" label="评论内容">

      </el-table-column>
      <el-table-column prop="" label="添加时间" width="100">
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">修改</el-button>
</template>
      </el-table-column>

    </el-table>
  
        <el-footer>
          <div class="tab_foot">
            <div class="t_l">
              
            </div>
            <div class="shanshu">
               <el-button type="danger" style="letter-spacing:2px;font-size:16px;">删除</el-button>
            </div>
          </div>
        </el-footer>
    </el-main>
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pagenumber"
          :page-size="per_page"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
  </el-container>

</template>

<script>
export default {
  name: 'good_comment_list',
  props: {

  },
  data() {
    return {
      recordval: 0,
      goodcommentlist: [],
      multipleSelection: [],
      goodcommentlistLoading: false,
      pagenumber: 1,
      total: 0
    }

  },
  created() {

  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>
