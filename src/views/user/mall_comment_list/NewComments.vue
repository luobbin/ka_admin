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
  .tit {
    // padding-top: 20px;
    .fh {
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
    <el-button type="text" @click="fh" class="fh">返回上一层</el-button>
    <h2>新增评论</h2>
  </div>

  <el-form ref="formdatd" :model="formdatd" label-width="200px">
    <el-form-item label="商城名" style="width:100%;">
      <el-select 
        class="item-choose" 
        v-model="formdatd.mall_id" 
        size="small" 
        style="width:25%;" 
        clearable 
        placeholder="全部">
        <el-option 
          v-for="item in ly" 
          :key="item.value" 
          :label="item.label" 
          :value="item.value" ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="会员">
      <el-input v-model="formdatd.ddusername" size="small"></el-input>
    </el-form-item>
    <el-form-item label="评论">
      <el-input type="textarea" v-model="formdatd.content" rows="8" size="small"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="letter-spacing:2px" >保存</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
import { fetchXialadata,fetchAddmalldata } from '@/api/mall_comments'

export default {
  name: 'NewCommentsShow',
  props: [],
  data() {
    return {
      xzplshow: 'true',
      formdatd: {
        mall_id:'',
        ddusername: '',
        content: ''
      },
      ly:[]
    }
  },
  computed:{
    
  },
  created(){
    fetchXialadata().then(res => {
      //下拉选项
      res.data.map((item,index) => {
        var scpl ={
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
    fh() {
      this.xzplshow = false; //关闭当前页面
      this.$emit('xzplClose', this.xzplshow)
    },
    onSubmit() {
      this.$confirm('确认是要发布评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //传给后台的数据
        fetchAddmalldata(this.formdatd).then(res=> {
          console.log(res.data);
        })
        this.$message({
          type: 'success',
          message: '发布成功!(当UID后台数据库没有时，前台页面将不会显示会员名，未处理)'
        });
        this.xzplshow = false; //关闭当前页面
        this.$emit('xzplClose', this.xzplshow);
        this.$emit('newCommentdata', this.formdatd);//发送当前列表的信息
        console.log(this.formdatd);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消发布'
        });
      });
    }
  }
}
</script>
