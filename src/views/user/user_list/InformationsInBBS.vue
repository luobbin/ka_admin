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
  .tit{
    padding-top: 20px;
    .fh{
      margin-left:10px ;
    }
    h2{
      margin: 0 30%;
      display: inline;
      letter-spacing: 2px;
    }
  }
  .el-form {
    width: 75%;
    padding-top: 40px;
  }
}
</style>
<template>
  <div class="mian">
    <div class="tit">
      <el-button type="text" @click="fh" class="fh">返回上一层</el-button>
      <h2>批量发送站内信</h2>
    </div>
    
    <el-form ref="form" :model="form" label-width="200px">
      <el-form-item label="会员">
        <el-input v-model="form.name" size="small" ></el-input><span style="color:#ccc;">用“|”隔开会员名可群发。不填写将发送全站会员</span>
      </el-form-item>
      <el-form-item label="通知内容">
        <el-input type="textarea" v-model="form.desc" rows="8"  size="small" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="letter-spacing:2px" size="small" >立即发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name:'InformationsInBBS',
  props: [],
  data() {
    return {
      InformationsInBBSShow:'true',
      form: {
        name: '',
        desc: ''
      }
    }
  },
  methods:{
    fh(){
      this.InformationsInBBSShow = false;//关闭当前页面
      this.$emit('InformationsInBBSClose', this.InformationsInBBSShow)
    },
    onSubmit() {
      console.log('提交事件!');
    }
  }
}
</script>
