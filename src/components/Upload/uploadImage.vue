<!-- 服务端上传展示 -->
<template>
    <div class="upload-container">
        <el-upload class="image-uploader" drag :multiple="false" :show-file-list="false" :action="uploadUrl+'/single_upload'"
            :on-success="handleImageScucess" :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div v-if="imageUrl!==null" v-show="imageUrl.length>0" class="image-preview">
          <div class="image-preview-wrapper" v-show="imageUrl.length>1">
            <img :src="imageUrl">
            <div class="image-preview-action">
              <i @click="rmImage" class="el-icon-delete"></i>
            </div>
          </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'imageUpload',
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
      uploadUrl: process.env.BASE_API,
      tempUrl: '',
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageScucess(res, file) {
      console.log("上传文件后返回结果",res);
      this.tempUrl = res.url
      this.emitInput(this.tempUrl)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt3M = file.size / 1024 / 1024 < 3
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
      //return isJPG && isLt2M
      return isLt3M
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  width: 100%;
  height: 100%;
  position: relative;
  .image-uploader {
    height: 100%;
  }
  .image-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
