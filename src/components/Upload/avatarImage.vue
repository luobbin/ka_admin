<!-- 七牛云上传用户头像-->
<template>
    <div class="upload-container">
        <el-upload class="avatar-uploader" :data="dataObj" drag :multiple="false" :show-file-list="false" action="https://upload-z2.qiniup.com"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tempUrl!=''" :src="tempUrl+'?imageView2/1/w/200/h/200'" class="avatar">
            <img v-else-if="imageUrl" :src="imageUrl+'?imageView2/1/w/200/h/200'" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
// 预览效果见付费文章
import { getToken } from '@/api/qiniu'

export default {
  name: 'avatarImageUpload',
  props: {
    value: String
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' }
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleAvatarSuccess() {
      this.emitInput(this.tempUrl)
    },
    beforeAvatarUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          this.tempUrl = response.data.qiniu_url
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    }
  }
}
</script>
<style>
  .upload-container{
    width: 158px; height: 158px; clear: both;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 158px;
    height: 158px;
    line-height: 158px;
    text-align: center;
  }
  .upload-container .el-upload .el-upload-dragger{
    width: auto; height: auto;
  }
  .avatar {
    width: 158px;
    height: 158px;
    float: left;
  }
</style>
