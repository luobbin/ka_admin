<style rel="stylesheet/scss" lang="scss" scoped>
.mian {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFF;
  z-index: 3;
  width: 100%;
  .tit {
    // padding-top: 20px;
    .xgfh {
      margin-left: 10px;
    }
    h2 {
      margin: 0 30%;
      display: inline;
      letter-spacing: 5px;
    }
  }
  .el-form {
    width: 75%;
    padding-top: 20px;
  }
}
</style>
<template>
<div class="mian">
  <div class="tit">
    <el-button type="text" @click="xgfh" class="xgfh">返回上一层</el-button>
    <h2>修改评论</h2>
  </div>

  <el-form ref="form" :model="ReviseTheCommentdata" label-width="200px">
    <el-form-item label="商城名" style="width:100%;">
      <el-select 
        class="item-choose" 
        v-model="ReviseTheCommentdata.mall.id" 
        size="small" 
        style="width:25%;" 
        clearable 
        >
        <el-option 
          v-for="item in ly" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value" ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="会员">
      <el-input v-model="ReviseTheCommentdata.user.ddusername" size="small"></el-input>
    </el-form-item>
    <el-form-item label="评论">
      <el-input type="textarea" v-model="ReviseTheCommentdata.content" rows="8" size="small"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="letter-spacing:2px" >修改</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
import { fetchXialadata  } from '@/api/mall_comments'

export default {
  name: 'ReviseTheComment',
  props: ['ReviseTheCommentdata'],
  data() {
    return {
      xgplshow: 'true',
      ly:[]
    }
  },
  created(){
    fetchXialadata().then(res => {
      //下拉选项
      res.data.map((item,index) => {
        var scpl = {
          value: '', 
          label: ''
        };
        scpl.value = item.id;
        scpl.label = item.title;
        this.ly.push(scpl);
      })
    })
  },
  methods: {
    xgfh() {
      this.xgplshow = false; //关闭当前页面
      this.$emit('xgplClose', this.xgplshow)
    },
    onSubmit() {
      this.$confirm('确认是要修改评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!（没有接口无法更改）'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '修改失败'
        });
      });
    }
  }
}
</script>
