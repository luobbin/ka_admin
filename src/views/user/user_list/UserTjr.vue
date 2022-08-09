<template>
  <div class="mian" v-loading="Loading" element-loading-text="加载中"> 
    <div class="tit">
      <el-button type="text" @click="fh" class="fh">返回上一层</el-button>
      <h2>会员推荐人修改</h2>
    </div>
    <el-form ref="GGuserdata" :model="GGuserdata" label-width="250px">
      <el-form-item style="color:rgb(233,25,7)">
        *该处修改推荐人，会将会员下八代的推荐人关系也进行修复
      </el-form-item>      
      <el-form-item label="会员：">
        ID：{{GGuserdata.id}} 用户名：{{GGuserdata.ddusername}}
      </el-form-item>
      <el-form-item label="原推荐人：" >
        <div v-if="GGuserdata.tuijianren!=null" >
          ID：{{GGuserdata.tuijianren.id}} 用户名：{{GGuserdata.tuijianren.ddusername}}
        </div>
        <div v-else>没有推荐人</div>
      </el-form-item>
      <el-form-item label="新推荐人：">
        <el-input clearable v-model="newTjrName" placeholder="输入新推荐人账号"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="success" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { fetchData, updateData } from '@/api/userlist'

export default {
  name:'UserTjr',
  provide: function () {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      GGuserdata:{
        id: undefined,
        ddusername: '',
        tuijianren: null,
      },
      newTjrName:'',
      Loading:true,
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods:{
    fh(){
      this.$router.go(-1)
    },
    fetchData(id) {
      this.Loading = true
      fetchData(id).then(response => {
        this.GGuserdata = response.data
        this.Loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit(){
      if(this.newTjrName==''){
        this.$notify({
          title: '提示',
          message: '请输入新推荐人名',
          type: 'warning',
          duration: 2000
        })
        return false
      }
      // if(this.GGuserdata.tuijianren != null){
      //   if(this.GGuserdata.tuijianren.ddusername == this.newTjrName){
      //     this.$notify({
      //       title: '提示',
      //       message: '不能是原推荐人',
      //       type: 'warning',
      //       duration: 2000
      //     })
      //     return false
      //   }
      // }
      //提交表单
      this.Loading = true
      const tempData = {new_tjrname:this.newTjrName}
      updateData(tempData,this.GGuserdata.id).then(response => {
        this.Loading = false
        if(response.data.code==200){
          this.$notify({
            title: '提示',
            message: response.data.message,
            type: 'success',
            duration: 3000
          })
          this.GGuserdata.tuijianren.id = response.data.tjr_id
          this.GGuserdata.tuijianren.ddusername = this.newTjrName
        }else{
          this.$notify({
            title: '提示',
            message: response.data.message,
            type: 'error',
            duration: 3000
          })
        }
      })
      
    },
    reload(){
      this.isRouterAlive = false
      this.$nextTick({
        function(){
          this.isRouterAlive = true
        }
      })
    }
  }
}
</script>
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
      letter-spacing: 3px;
    }
  }
  .el-form{
    width: 60%;
    padding-top: 20px;
  }
}
</style>