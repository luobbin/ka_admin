<style rel="stylesheet/scss" lang="scss" scoped>
.mian {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFF;
  z-index: 2;
  width: 100%;
  height: 1300px;
  .fh{
    margin-left:10px ;
  }
  h2{
    margin: 0 40%;
    display: inline;
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
    width: 100%;
    padding: 65px 25px 25px 15px !important;
    .tab_foot {
      width: 100%;
      height: 60px;
      line-height: 60px;
      border: 1px solid #f5f5f5;
      border-top: 0;
      .block {
        transform: translate(0, 20%);
        margin-left: 45%;
        display: inline-block;
      }
    }
  }
}
</style>
<template>
  <div class="mian">
    <el-button type="text" @click="fh" class="fh">返回上一层</el-button>
    <h2>淘宝浏览记录</h2>
      <el-header class="tit">
    <div class="l_box">
      <ul>
        <li>
          【系统会自动删除10天前的购物记录】
        </li>
      </ul>
    </div>
    <div class="r_box">
      <ul>
        <li>
          <el-select class="item-choose" v-model="hyvalue" size="small" style="width:115px;" clearable>
            <el-option v-for="item in hy" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          :
          <el-input style="width:150px;" clearable size="small">
          </el-input>
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
    <el-table 
      border 
      size="small" 
      :data="tblist" 
      v-loading="tblistLoading" 
      highlight-current-row 
      tooltip-effect="dark" 
      style="text-align:center;">
      <el-table-column
        prop=""
        label="会员名">
      </el-table-column>
      <el-table-column
        prop=""
        label="搜索记录">
      </el-table-column>
      <el-table-column
        prop=""
        label="时间">
      </el-table-column>

    </el-table>
      <div class="tab_foot">
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

  </div>
</template>
<script>
export default {
  name:'TaobaoBrowseRecord',
  props: [],
  data() {
    return {
      tbjlshow:'true',
      tblist: [],
      tblistLoading: false,//加载展示
      pagenumber: 1,
      total: 0,
      hy: [{
        value: 'hyuser',
        label: '会员'
      }, {
        value: 'spid',
        label: '商品ID'
      }, {
        value: 'gjc',
        label: '关键词'
      }],
      hyvalue: "",//会员下拉
    }
  },
  methods:{
    fh(){
      this.tbjlshow = false;//关闭当前页面
      this.$emit('tbjlClose', this.tbjlshow)
    },
    handleCurrentChange(val) {
      //刷新分页信息
      console.log(`当前页: ${val}`);
    },
  }
}
</script>
