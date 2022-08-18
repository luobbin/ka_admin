<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" label-width="130px">
      <sticky className="sub-navbar draft">
        <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">保存</el-button>
      </sticky>

      <h2>首页顶部视频设置</h2>

      <div style="clear: both; height: 100px; line-height: 100px"></div>

      <el-form-item label="PC版顶部视频" prop="pc_video_url">
        <el-col :span="8">
          <FileUpload v-model="postForm.application.pc_video_url" />
        </el-col>
        <br>
        <span style="color: red"> [必填,建议尺寸：宽1920px*高1000px，格式mp4]</span>
      </el-form-item>
      <el-form-item label="手机版顶部封面" prop="mob_img_url">
        <el-col :span="16">
          <Upload v-model="postForm.application.mob_img_url" />
        </el-col>
        <br>
        <span style="color: red"> [必填,建议尺寸：宽1920px*高1000px，格式JPG，PNG]</span>
      </el-form-item>
      <el-form-item label="手机版顶部标题" prop="mob_h3">
        <el-input v-model="postForm.application.mob_h3"></el-input>
      </el-form-item>
      <el-form-item label="手机版顶部介绍" prop="mob_p">
        <el-input v-model="postForm.application.mob_p"></el-input>
      </el-form-item>
      <el-form-item label="手机版顶部链接" prop="mob_a_url">
        <el-input v-model="postForm.application.mob_a_url"></el-input>
      </el-form-item>

      <el-form-item label="首页展示">
        <el-radio-group v-model="postForm.if_show">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/uploadImage'
import FileUpload from '@/components/Upload/uploadFile'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchData, updateData } from '@/api/homeset'
//初始化表单
const defaultForm = {
  id:7,
  if_show:1,
  application: {
    pc_video_url: '',
    mob_img_url: '',
    mob_h3: '',
    mob_p: '',
    mob_a_url: '',
  }
}

export default {
  name: 'videosDetail',
  components: { Tinymce, Upload, Sticky, FileUpload},
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        // pc_video_url: [{ required: true, message: '请上传视频', trigger: 'blur' }],
        // mob_img_url: [{ required: true, message: '请上传图片', trigger: 'change' }],
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
            if(response.data.code==200){
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

          this.$router.push('/homeset/heads')
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
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
