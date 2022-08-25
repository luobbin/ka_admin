<!-- 服务端上传展示 -->
<template>
    <div class="upload-container">
        <el-upload class="el-upload" drag :multiple="false" :show-file-list="false" :action="uploadUrl+'/doc_upload'"
            :on-success="handleImageScucess" :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="file-preview" v-show="fileUrl!==null && fileUrl.length>1">
          <a :href="fileUrl" target="_blank">{{ fileUrl }}</a>
          <i @click="rmFile" class="el-icon-delete"></i>
        </div>
    </div>
</template>

<script>

export default {
  name: 'fileUpload',
  props: {
    value: String
  },
  computed: {
    fileUrl() {
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
    rmFile() {
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
      const isLt2M = file.size / 1024 / 1024 < 50
      if (!isLt2M) {
        this.$message.error('上传大小不能超过 50MB!')
      }
      return isLt2M
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
