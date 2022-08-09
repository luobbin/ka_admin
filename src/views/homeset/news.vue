<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" label-width="130px">
      <sticky className="sub-navbar draft">
        <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">保存</el-button>
      </sticky>

      <h2>首页新闻动态设置</h2>

      <div style="clear: both; height: 100px; line-height: 100px"></div>

      <el-form-item label="首页展示">
        <el-radio-group v-model="postForm.if_show">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="获取方式">
        <el-radio-group v-model="postForm.application.way">
          <el-radio :label="1">按照最新发布时间</el-radio>
          <el-radio :label="2">按照首页展示状态</el-radio>
          <el-radio :label="3">按照排序方式</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="展示个数">
        <el-col :span="2"><el-input v-model="postForm.application.show_count"></el-input></el-col>
      </el-form-item>


    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchData, updateData } from '@/api/homeset'
//初始化表单
const defaultForm = {
  id:4,
  if_show:1,
  application: {
    way:1,
    show_count:6
  },//特点
}

export default {
  name: 'newsDetail',
  components: { Tinymce, Sticky},
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        id: [{ required: true, message: '请输入id', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData(defaultForm.id)
  },
  methods: {
    fetchData(id) {
      fetchData(id).then(response => {
        console.log("this.postForm",response.data)
        this.postForm = response.data
        this.postForm.application = JSON.parse(this.postForm.application)
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const postData = Object.assign({}, this.postForm)
          updateData(postData,postData.id).then(response => {
            if(response.data.code===200){
              this.$notify({
                title: '成功',
                message: response.data.message,
                type: 'success',
                duration: 2000
              })
            }else{
              this.$notify({
                title: '失败',
                message: response.data.error,
                type: 'error',
                duration: 2000
              })
            }
          })

          this.$router.push('/homeset/news')
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.tip{
  color:#ccc;
  font-size:10px;
  padding-left:5px;
}
.txt_r{text-align: right;}
.list-items{
  width: 100%;
  clear: both;
  padding: 0 10px;
  border-top: 1px solid #eee;
}
.list-items .detail-item{
  border-bottom: 1px solid #eee;
  width: 100%;
  padding-bottom: 5px;
  padding-top: 5px;
  clear: both;
}
.list-add{
  float: right;
  margin-top: -5px;
}
</style>
